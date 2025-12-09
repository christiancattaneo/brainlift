import { BrainliftSection, SectionGrade, SECTIONS_CONFIG, TractionEvidence, MilestoneBonus, MILESTONE_CONFIG, TRACTION_CONFIG, TractionType, MilestoneType } from '@/types';

export const RUBRIC = `
# BUSINESS BRAINLIFT GRADING RUBRIC

## Grading Categories
- **Thoroughness (30 points total)**: Depth and completeness of each section
- **Viability (30 points total)**: Proof of real business potential with data-backed claims
- **Executability (40 points total)**: Actionable, realistic plans that teens can execute

## Pass Threshold: 80% (80/100 points)

## CRITICAL INSTRUCTION:
You MUST NOT exceed the maximum points for any category. Scores are CAPPED at the maximum shown.
If content deserves more than the max, still award ONLY the max.

## Section-by-Section Rubric:

### 1. Strategic Vision (3 pts Thoroughness MAX)
- Business overview (problem, customers): 1 pt - Clearly describes problem (0.5) and target customers with specifics (0.5)
- UVP (defensibility, scalability): 1 pt - Explains unique edge (0.5) and scalability with moats (0.5)
- Why viable (demand evidence): 0.5 pt - Provides market timing/personal fit with evidence
- Self-assessment (enterprise proof or kill): 0.5 pt - Justifies viability with math or explicit kill rationale

### 2. Long-Term Vision (2 pts Thoroughness MAX)
- Year 1 milestones: 0.5 pt - Lists 3-5 specific, phased milestones
- Year 2 milestones: 0.5 pt - Details scaling steps
- Year 3 vision: 0.5 pt - Quantifies size ($X revenue, Y% share)
- Exit strategy: 0.5 pt - Outlines 1-2 paths with rationale

### 3. Semester Targets (2 pts Thoroughness MAX, 3 pts Viability MAX)
- Revenue goal: 1 pt T + 1 pt V - Bold metric with math/assumptions
- Milestones: 0.5 pt T + 1 pt V - 3-4 timed milestones with logical path
- KPIs: 0.5 pt T + 0.5 pt V - 2-3 measurable KPIs
- Dependencies: Integrated into above

### 4. 30-Day Gameplan (3 pts Thoroughness MAX, 15 pts Executability MAX)
- Week 1 Foundation: 0.5 pt T + 2 pts E - 3-5 tasks with timelines/tools
- Week 2 Build/Launch: 0.5 pt T + 3 pts E - Step-by-step build with deadlines
- Week 3 Acquire/Test: 0.5 pt T + 3 pts E - Outreach tactics with scripts/targets
- Week 4 Iterate/Measure: 0.5 pt T + 2 pts E - Analysis steps with pivot readiness
- Subcategories (Product, Marketing, Ops, Financials, Risks): 1 pt T + 5 pts E total

### 5. Market and Competitive Analysis (3 pts Thoroughness MAX, 10 pts Viability MAX)
- Target market: 1 pt T + 3 pts V - Size/segments/personas with quantified TAM
- Trends/opportunity: 1 pt T + 3 pts V - 2-3 trends with sources
- Competitors: 0.5 pt T + 2 pts V - 3-5 listed with SWOT-style analysis
- Validation evidence: 0.5 pt T + 2 pts V - 2-3 proofs (surveys, pre-sales)

### 6. Product/Service Description (4 pts Thoroughness MAX)
- Features/benefits: 1 pt - 4-6 core items with customer benefits
- Roadmap: 1 pt - Short vs. long-term steps, timed
- Business model: 1 pt - Monetization paths with examples
- Stack: 1 pt - Tools/suppliers listed and justified

### 7. Skills and Resources Needed (3 pts Thoroughness MAX, 15 pts Executability MAX)
- 1-Month needs: 1 pt T + 4 pts E - 3-5 skills/resources with immediate acquisition steps
- 4.5-Month needs: 1 pt T + 4 pts E - Scaling needs with budgets/timelines
- Acquisition plan: 0.5 pt T + 4 pts E - How/when details with actionable methods
- Gaps/risks: 0.5 pt T + 3 pts E - Mitigation for 2-3 gaps

### 8. Financial Projections (4 pts Thoroughness MAX, 7 pts Viability MAX)
- Revenue model: 1 pt T + 2 pts V - Sources/pricing, diversified
- Costs: 1 pt T + 1 pt V - Fixed/variable breakdown
- Projections: 1 pt T + 2 pts V - Monthly cash flow, break-even
- Justification: 1 pt T + 2 pts V - Assumptions, sensitivity analysis

### 9. Risks, Mitigation, and Contingencies (3 pts Thoroughness MAX, 10 pts Viability MAX, 10 pts Executability MAX)
- Top risks: 1 pt T + 3 pts V + 2 pts E - 3-5 prioritized risks with impact/timelines
- Strategies: 1 pt T + 3 pts V + 3 pts E - Per-risk mitigations with feasible steps
- Plans: 0.5 pt T + 2 pts V + 3 pts E - Backup scenarios with triggers
- Kill criteria: 0.5 pt T + 2 pts V + 2 pts E - 2-3 measurable thresholds

### 10. Appendix (3 pts Thoroughness MAX)
- Research sources: 1 pt - 5+ credible links, annotated
- Early artifacts: 1 pt - 2-3 items (prototypes, feedback)
- Pitch notes: 1 pt - Key talking points for presentation
`;

export function buildGradingPrompt(section: BrainliftSection): string {
  const config = SECTIONS_CONFIG.find(s => s.id === section.id);
  
  return `You are an expert entrepreneurship mentor grading a teen founder's Business Brainlift submission.

${RUBRIC}

## YOUR TASK
Grade the following section: "${section.title}"

MAXIMUM points for this section (DO NOT EXCEED):
- Thoroughness: ${config?.thoroughnessMax || 0} points MAX
- Viability: ${config?.viabilityMax || 0} points MAX
- Executability: ${config?.executabilityMax || 0} points MAX

## SECTION CONTENT:
${section.content}

## CRITICAL INSTRUCTIONS
1. NEVER exceed the maximum points for any category
2. Be fair but rigorous - this is about validating real business viability
3. Consider that submitters are ambitious teen founders (14-18 years old)
4. Award partial points where appropriate (e.g., 0.5, 1.5, 2.5)
5. If the section is exceptional, award the MAX but never more

## RESPONSE FORMAT (JSON only, no markdown):
{
  "thoroughnessScore": <number, max ${config?.thoroughnessMax || 0}>,
  "viabilityScore": <number, max ${config?.viabilityMax || 0}>,
  "executabilityScore": <number, max ${config?.executabilityMax || 0}>,
  "analysis": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"]
}

Respond with ONLY the JSON object, no additional text.`;
}

export function buildTractionAnalysisPrompt(fullContent: string): string {
  return `You are an expert entrepreneurship mentor analyzing a Business Brainlift submission for REAL TRACTION and PROGRESS.

## YOUR TASK
Analyze the following business plan for evidence of REAL progress and traction. Look for:

1. **Paying Customers** - Any mention of actual paying users/customers with numbers
2. **Revenue** - Any actual revenue generated (not projections)
3. **Waitlist/Signups** - People who have signed up or expressed interest
4. **MVP Built** - A minimum viable product that exists and works
5. **Prototype** - A working prototype or demo
6. **Partnerships** - Actual partnerships secured (not planned)
7. **LOI/Commitments** - Letters of intent or signed commitments
8. **Pre-sales** - Money collected before product launch
9. **User Feedback** - Real feedback from real users (interviews, surveys completed)
10. **Pilot Program** - An active pilot with real users/customers
11. **Social Proof** - Followers, testimonials, reviews
12. **Press Coverage** - Media mentions or coverage

## CONTENT TO ANALYZE:
${fullContent}

## INSTRUCTIONS
- Only include traction that is EXPLICITLY mentioned in the content
- Include the specific numbers/details mentioned
- Mark as "verified" if there's a link, screenshot, or concrete proof mentioned
- Be conservative - don't infer traction that isn't clearly stated
- Focus on ACTUAL progress, not plans or projections

## RESPONSE FORMAT (JSON only, no markdown):
{
  "traction": [
    {
      "type": "<one of: paying_customers, revenue, waitlist_signups, mvp_built, prototype, partnerships, loi_signed, presales, user_feedback, pilot_program, social_proof, press_coverage>",
      "description": "<specific description of the traction>",
      "value": <number if applicable, otherwise null>,
      "verified": <true if proof/link mentioned, false otherwise>
    }
  ],
  "milestoneProgress": {
    "30_day": <0-100 percentage of 30-day goals completed based on evidence>,
    "semester": <0-100 percentage toward semester targets based on evidence>,
    "year_1": <0-100 percentage toward year 1 milestones based on evidence>,
    "year_2_3": <0-100 percentage toward long-term vision based on evidence>
  }
}

Respond with ONLY the JSON object, no additional text.`;
}

export function buildFinalSummaryPrompt(grades: SectionGrade[], traction: TractionEvidence[]): string {
  const gradesJson = JSON.stringify(grades, null, 2);
  const tractionJson = JSON.stringify(traction, null, 2);
  
  const baseScore = grades.reduce((sum, g) => sum + g.totalScore, 0);
  
  return `You are an expert entrepreneurship mentor providing final feedback on a Business Brainlift submission.

## BASE PLAN GRADES:
${gradesJson}

## TRACTION EVIDENCE DETECTED:
${tractionJson}

## SCORE SUMMARY:
- Base Plan Score: ${baseScore}/100
- Pass Threshold: 80%
- Status: ${baseScore >= 80 ? 'PASSED' : 'NEEDS WORK'}

## INSTRUCTIONS
Provide a final summary that:
1. Gives an overall assessment of the business plan quality
2. Acknowledges any real traction/progress demonstrated
3. Highlights the strongest aspects
4. Identifies critical areas needing improvement
5. Provides 3-5 actionable top recommendations

## RESPONSE FORMAT (JSON only, no markdown):
{
  "overallAnalysis": "<3-4 sentence comprehensive assessment acknowledging both plan quality and any real progress>",
  "topRecommendations": [
    "<specific, actionable recommendation 1>",
    "<specific, actionable recommendation 2>",
    "<specific, actionable recommendation 3>"
  ]
}

Respond with ONLY the JSON object, no additional text.`;
}

/**
 * Calculate bonus points from traction evidence
 */
export function calculateTractionBonus(traction: TractionEvidence[]): number {
  let bonus = 0;
  
  for (const t of traction) {
    const config = TRACTION_CONFIG[t.type];
    if (config) {
      const basePoints = config.basePoints;
      const multiplier = t.verified ? config.verifiedMultiplier : 1;
      bonus += basePoints * multiplier;
    }
  }
  
  return Math.round(bonus * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate milestone bonuses based on progress
 */
export function calculateMilestoneBonuses(
  milestoneProgress: Record<MilestoneType, number>,
  traction: TractionEvidence[]
): MilestoneBonus[] {
  const milestones: MilestoneBonus[] = [];
  
  for (const [milestone, config] of Object.entries(MILESTONE_CONFIG) as [MilestoneType, typeof MILESTONE_CONFIG[MilestoneType]][]) {
    const progress = milestoneProgress[milestone] || 0;
    const earnedBonus = Math.round((progress / 100) * config.maxBonus * 10) / 10;
    
    // Find traction evidence relevant to this milestone
    const relevantTraction = traction.filter(t => {
      if (milestone === '30_day') {
        return ['mvp_built', 'prototype', 'user_feedback'].includes(t.type);
      } else if (milestone === 'semester') {
        return ['paying_customers', 'revenue', 'waitlist_signups', 'presales'].includes(t.type);
      } else if (milestone === 'year_1') {
        return ['partnerships', 'pilot_program', 'loi_signed'].includes(t.type);
      } else {
        return ['press_coverage', 'social_proof'].includes(t.type);
      }
    });
    
    milestones.push({
      milestone,
      label: config.label,
      maxBonus: config.maxBonus,
      earnedBonus: Math.min(earnedBonus, config.maxBonus),
      progressPercent: progress,
      evidence: relevantTraction,
      color: config.color,
    });
  }
  
  return milestones;
}
