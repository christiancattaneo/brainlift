import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { 
  BrainliftSection, 
  SectionGrade, 
  SECTIONS_CONFIG, 
  GradingStreamEvent,
  TractionEvidence,
  MilestoneType,
  GradingResult,
  ConsistencyAnalysis,
  ConsistencyIssue
} from '@/types';
import { 
  buildGradingPrompt, 
  buildFinalSummaryPrompt, 
  buildTractionAnalysisPrompt,
  buildConsistencyAnalysisPrompt,
  calculateTractionBonus,
  calculateMilestoneBonuses,
  calculateConsistencyPenalty
} from '@/lib/grading';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const { sections } = await request.json() as { sections: BrainliftSection[] };
        
        if (!sections || sections.length === 0) {
          const errorEvent: GradingStreamEvent = {
            type: 'error',
            message: 'No sections provided for grading',
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
          controller.close();
          return;
        }
        
        const grades: SectionGrade[] = [];
        
        // Grade each section
        for (const section of sections) {
          const config = SECTIONS_CONFIG.find(s => s.id === section.id);
          if (!config) continue;
          
          // Send start event
          const startEvent: GradingStreamEvent = {
            type: 'section_start',
            sectionId: section.id,
            sectionTitle: section.title,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(startEvent)}\n\n`));
          
          // Send progress event
          const progressEvent: GradingStreamEvent = {
            type: 'section_progress',
            sectionId: section.id,
            message: 'Analyzing content...',
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(progressEvent)}\n\n`));
          
          try {
            const prompt = buildGradingPrompt(section);
            
            const message = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 1024,
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            });
            
            const responseText = message.content[0].type === 'text' 
              ? message.content[0].text 
              : '';
            
            // Parse the JSON response
            let gradeData;
            try {
              // Try to extract JSON from the response
              const jsonMatch = responseText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                gradeData = JSON.parse(jsonMatch[0]);
              } else {
                throw new Error('No JSON found in response');
              }
            } catch {
              // If parsing fails, use default values
              gradeData = {
                thoroughnessScore: 0,
                viabilityScore: 0,
                executabilityScore: 0,
                analysis: 'Unable to parse section',
                strengths: [],
                improvements: ['Please ensure the section follows the template structure'],
                emptyFields: [],
              };
            }
            
            // CRITICAL: Enforce maximum caps on all scores
            const thoroughnessScore = Math.min(
              Math.max(0, gradeData.thoroughnessScore || 0),
              config.thoroughnessMax
            );
            const viabilityScore = Math.min(
              Math.max(0, gradeData.viabilityScore || 0),
              config.viabilityMax
            );
            const executabilityScore = Math.min(
              Math.max(0, gradeData.executabilityScore || 0),
              config.executabilityMax
            );
            
            const grade: SectionGrade = {
              sectionId: section.id,
              sectionTitle: section.title,
              thoroughnessScore,
              thoroughnessMax: config.thoroughnessMax,
              viabilityScore,
              viabilityMax: config.viabilityMax,
              executabilityScore,
              executabilityMax: config.executabilityMax,
              totalScore: thoroughnessScore + viabilityScore + executabilityScore,
              totalMax: config.thoroughnessMax + config.viabilityMax + config.executabilityMax,
              analysis: gradeData.analysis || '',
              strengths: gradeData.strengths || [],
              improvements: gradeData.improvements || [],
              emptyFields: gradeData.emptyFields || [],
              status: 'complete',
            };
            
            grades.push(grade);
            
            // Send complete event
            const completeEvent: GradingStreamEvent = {
              type: 'section_complete',
              sectionId: section.id,
              data: grade,
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(completeEvent)}\n\n`));
            
          } catch (error) {
            console.error(`Error grading section ${section.id}:`, error);
            
            const errorGrade: SectionGrade = {
              sectionId: section.id,
              sectionTitle: section.title,
              thoroughnessScore: 0,
              thoroughnessMax: config.thoroughnessMax,
              viabilityScore: 0,
              viabilityMax: config.viabilityMax,
              executabilityScore: 0,
              executabilityMax: config.executabilityMax,
              totalScore: 0,
              totalMax: config.thoroughnessMax + config.viabilityMax + config.executabilityMax,
              analysis: 'Error grading this section',
              strengths: [],
              improvements: ['Please review and resubmit'],
              emptyFields: [],
              status: 'error',
            };
            grades.push(errorGrade);
            
            const errorEvent: GradingStreamEvent = {
              type: 'section_complete',
              sectionId: section.id,
              data: errorGrade,
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
          }
          
          // Small delay between sections for visual effect
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // TRACTION ANALYSIS - Scan for real progress
        const tractionProgressEvent: GradingStreamEvent = {
          type: 'section_progress',
          message: 'Analyzing traction and progress...',
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(tractionProgressEvent)}\n\n`));
        
        let traction: TractionEvidence[] = [];
        let milestoneProgress: Record<MilestoneType, number> = {
          '30_day': 0,
          'semester': 0,
          'year_1': 0,
          'year_2_3': 0,
        };
        
        try {
          // Combine all section content for traction analysis
          const fullContent = sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n');
          const tractionPrompt = buildTractionAnalysisPrompt(fullContent);
          
          const tractionMessage = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: tractionPrompt,
              },
            ],
          });
          
          const tractionText = tractionMessage.content[0].type === 'text'
            ? tractionMessage.content[0].text
            : '';
          
          try {
            const jsonMatch = tractionText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const tractionData = JSON.parse(jsonMatch[0]);
              traction = tractionData.traction || [];
              milestoneProgress = tractionData.milestoneProgress || milestoneProgress;
            }
          } catch {
            console.error('Failed to parse traction data');
          }
          
          // Send traction analysis event
          const tractionEvent: GradingStreamEvent = {
            type: 'traction_analysis',
            data: traction,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(tractionEvent)}\n\n`));
          
        } catch (error) {
          console.error('Error analyzing traction:', error);
        }
        
        // CONSISTENCY ANALYSIS - Check for contradictions and coherence
        const consistencyProgressEvent: GradingStreamEvent = {
          type: 'section_progress',
          message: 'Checking cross-section consistency...',
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(consistencyProgressEvent)}\n\n`));
        
        let consistency: ConsistencyAnalysis = {
          overallCoherence: 100,
          issues: [],
          consistencyPenalty: 0,
        };
        
        try {
          // Build section summaries for consistency check
          const fullContent = sections.map(s => `## ${s.title}\n${s.content}`).join('\n\n');
          const sectionSummaries = grades.map(g => ({
            id: g.sectionId,
            title: g.sectionTitle,
            keyPoints: g.analysis,
          }));
          
          const consistencyPrompt = buildConsistencyAnalysisPrompt(fullContent, sectionSummaries);
          
          const consistencyMessage = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            messages: [
              {
                role: 'user',
                content: consistencyPrompt,
              },
            ],
          });
          
          const consistencyText = consistencyMessage.content[0].type === 'text'
            ? consistencyMessage.content[0].text
            : '';
          
          try {
            const jsonMatch = consistencyText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const consistencyData = JSON.parse(jsonMatch[0]);
              const issues: ConsistencyIssue[] = consistencyData.issues || [];
              const penalty = calculateConsistencyPenalty(issues);
              
              consistency = {
                overallCoherence: consistencyData.overallCoherence || 100,
                issues,
                consistencyPenalty: penalty,
              };
            }
          } catch {
            console.error('Failed to parse consistency data');
          }
          
          // Send consistency analysis event
          const consistencyEvent: GradingStreamEvent = {
            type: 'consistency_analysis',
            data: consistency,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(consistencyEvent)}\n\n`));
          
        } catch (error) {
          console.error('Error analyzing consistency:', error);
        }
        
        // Generate final summary
        const summaryProgressEvent: GradingStreamEvent = {
          type: 'section_progress',
          message: 'Generating final summary...',
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(summaryProgressEvent)}\n\n`));
        
        try {
          const summaryPrompt = buildFinalSummaryPrompt(grades, traction);
          
          const summaryMessage = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: summaryPrompt,
              },
            ],
          });
          
          const summaryText = summaryMessage.content[0].type === 'text'
            ? summaryMessage.content[0].text
            : '';
          
          let summaryData;
          try {
            const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              summaryData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error('No JSON found');
            }
          } catch {
            summaryData = {
              overallAnalysis: 'Grading complete. Please review individual section scores.',
              topRecommendations: ['Review each section for specific feedback'],
            };
          }
          
          // Calculate base score (capped at 100)
          const rawBaseScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
          
          // Apply consistency penalty
          const adjustedBaseScore = Math.max(0, rawBaseScore - consistency.consistencyPenalty);
          const baseScore = Math.min(adjustedBaseScore, 100);
          const baseMaxScore = 100;
          const basePercentage = Math.round((baseScore / baseMaxScore) * 100);
          
          // Calculate traction bonus and milestone bonuses
          const bonusScore = calculateTractionBonus(traction);
          const milestones = calculateMilestoneBonuses(milestoneProgress, traction);
          
          // Total includes base + bonus (but bonus doesn't offset consistency penalty for pass/fail)
          const totalScore = baseScore + bonusScore;
          const percentage = Math.round((totalScore / baseMaxScore) * 100);
          
          const finalResult: GradingResult = {
            sections: grades,
            baseScore,
            baseMaxScore,
            basePercentage,
            traction,
            milestones,
            bonusScore,
            consistency,
            totalScore,
            maxScore: baseMaxScore,
            percentage,
            passed: basePercentage >= 80, // Pass based on base score only (after consistency penalty)
            overallAnalysis: summaryData.overallAnalysis,
            topRecommendations: summaryData.topRecommendations,
            timestamp: new Date().toISOString(),
          };
          
          const finalEvent: GradingStreamEvent = {
            type: 'final_summary',
            data: finalResult,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalEvent)}\n\n`));
          
        } catch (error) {
          console.error('Error generating summary:', error);
          
          const rawBaseScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
          const adjustedBaseScore = Math.max(0, rawBaseScore - consistency.consistencyPenalty);
          const baseScore = Math.min(adjustedBaseScore, 100);
          const milestones = calculateMilestoneBonuses(milestoneProgress, traction);
          
          const finalResult: GradingResult = {
            sections: grades,
            baseScore,
            baseMaxScore: 100,
            basePercentage: Math.round((baseScore / 100) * 100),
            traction,
            milestones,
            bonusScore: 0,
            consistency,
            totalScore: baseScore,
            maxScore: 100,
            percentage: Math.round((baseScore / 100) * 100),
            passed: baseScore >= 80,
            overallAnalysis: 'Grading complete.',
            topRecommendations: [],
            timestamp: new Date().toISOString(),
          };
          
          const finalEvent: GradingStreamEvent = {
            type: 'final_summary',
            data: finalResult,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalEvent)}\n\n`));
        }
        
        controller.close();
        
      } catch (error) {
        console.error('Grading stream error:', error);
        const errorEvent: GradingStreamEvent = {
          type: 'error',
          message: error instanceof Error ? error.message : 'An error occurred during grading',
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
        controller.close();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
