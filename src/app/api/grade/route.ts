import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { BrainliftSection, SectionGrade, SECTIONS_CONFIG, GradingStreamEvent } from '@/types';
import { buildGradingPrompt, buildFinalSummaryPrompt } from '@/lib/grading';

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
              };
            }
            
            const grade: SectionGrade = {
              sectionId: section.id,
              sectionTitle: section.title,
              thoroughnessScore: Math.min(gradeData.thoroughnessScore || 0, config.thoroughnessMax),
              thoroughnessMax: config.thoroughnessMax,
              viabilityScore: Math.min(gradeData.viabilityScore || 0, config.viabilityMax),
              viabilityMax: config.viabilityMax,
              executabilityScore: Math.min(gradeData.executabilityScore || 0, config.executabilityMax),
              executabilityMax: config.executabilityMax,
              totalScore: 0,
              totalMax: config.thoroughnessMax + config.viabilityMax + config.executabilityMax,
              analysis: gradeData.analysis || '',
              strengths: gradeData.strengths || [],
              improvements: gradeData.improvements || [],
              status: 'complete',
            };
            
            grade.totalScore = grade.thoroughnessScore + grade.viabilityScore + grade.executabilityScore;
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
        
        // Generate final summary
        const summaryProgressEvent: GradingStreamEvent = {
          type: 'section_progress',
          message: 'Generating final summary...',
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(summaryProgressEvent)}\n\n`));
        
        try {
          const summaryPrompt = buildFinalSummaryPrompt(grades);
          
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
          
          const totalScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
          const maxScore = 100;
          const percentage = Math.round((totalScore / maxScore) * 100);
          
          const finalEvent: GradingStreamEvent = {
            type: 'final_summary',
            data: {
              sections: grades,
              totalScore,
              maxScore,
              percentage,
              passed: percentage >= 80,
              overallAnalysis: summaryData.overallAnalysis,
              topRecommendations: summaryData.topRecommendations,
              timestamp: new Date().toISOString(),
            },
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalEvent)}\n\n`));
          
        } catch (error) {
          console.error('Error generating summary:', error);
          
          const totalScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
          const maxScore = 100;
          const percentage = Math.round((totalScore / maxScore) * 100);
          
          const finalEvent: GradingStreamEvent = {
            type: 'final_summary',
            data: {
              sections: grades,
              totalScore,
              maxScore,
              percentage,
              passed: percentage >= 80,
              overallAnalysis: 'Grading complete.',
              topRecommendations: [],
              timestamp: new Date().toISOString(),
            },
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

