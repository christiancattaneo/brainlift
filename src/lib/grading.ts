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

### 1. Business Vision & Strategy (5 pts Thoroughness MAX, 5 pts Viability MAX)
This is the core strategic section combining business overview, model, and viability.

**Business Overview (2 pts T):**
- One-Liner Memo: 0.5 pt - Clear, compelling single sentence
- 30-Second Elevator Pitch: 1.5 pts - Complete problem/solution/market/value statement

**Strategic Overview (2 pts T, 3 pts V):**
- What Are You Selling: 0.5 pt T - Clear product/service description
- Who Pays & Why (Target Customer + Value Prop): 0.5 pt T + 1 pt V - Specific customer with clear value
- Problem/Solution: 0.5 pt T + 1 pt V - Well-defined problem with logical solution
- Business Model: 0.5 pt T + 0.5 pt V - Monetization paths with pricing
- Business-Founder Fit: Integrated into above
- Growth Model: Integrated into above

**Why Viable Now (1 pt T, 2 pts V):**
- Personal Edge: 0.5 pt T + 0.5 pt V - Why YOU can build this
- Market Timing: 0.25 pt T + 0.5 pt V - Why NOW is the right time
- Evidence of Market Demand: 0.25 pt T + 0.5 pt V - Data showing demand exists
- Current Traction: 0.5 pt V bonus if present - Any existing customers/revenue/waitlist

### 2. Market and Competitive Analysis (3 pts Thoroughness MAX, 10 pts Viability MAX)
- Target market: 1 pt T + 3 pts V - Size/segments/personas with quantified TAM/SAM/SOM
- Market trends/opportunity: 1 pt T + 3 pts V - 2-3 trends with credible sources
- Competitors: 0.5 pt T + 2 pts V - 3-5 listed with strengths/weaknesses/differentiation
- Validation evidence: 0.5 pt T + 2 pts V - Surveys, pre-sales, waitlist data

### 3. Semester Targets (2 pts Thoroughness MAX, 3 pts Viability MAX)
- Semester-Long Targets: 0.5 pt T + 1 pt V - Revenue/profit goals with math
- Key milestones: 0.5 pt T + 1 pt V - 3-4 timed milestones with logical progression
- Metrics for success (KPIs): 0.5 pt T + 0.5 pt V - 3-4 measurable KPIs
- Dependencies: 0.5 pt T + 0.5 pt V - Resources and partnerships needed

### 4. 30-Day Gameplan (3 pts Thoroughness MAX, 15 pts Executability MAX)
**30-Day Targets (0.5 pt T, 2 pts E):**
- 2-3 specific, measurable targets with clear success criteria

**Weekly Activity Schedule (1.5 pts T, 8 pts E):**
- Week 1 Foundation: 0.25 pt T + 2 pts E - Tasks with deliverables
- Week 2 Build/Launch: 0.5 pt T + 2 pts E - Step-by-step with deadlines
- Week 3 Acquire/Test: 0.5 pt T + 2 pts E - Outreach tactics with targets
- Week 4 Iterate/Measure: 0.25 pt T + 2 pts E - Analysis and iteration steps

**Subcategories (1 pt T, 5 pts E):**
- Product/Development: 0.2 pt T + 1 pt E - Tasks, timelines, tools
- Marketing/Sales: 0.2 pt T + 1 pt E - Channels, tactics, targets
- Operations/Systems: 0.2 pt T + 1 pt E - Processes, automation
- Financials: 0.2 pt T + 1 pt E - Budget, revenue targets
- Risks: 0.2 pt T + 1 pt E - Weekly mitigations

**Validation Evidence (bonus):** Pre-existing proof of demand adds credibility
**Execution Tools:** Listed tools/resources for quick starts

### 5. Skills and Resources Needed (3 pts Thoroughness MAX, 15 pts Executability MAX)
- 1-Month Needs: 1 pt T + 5 pts E - Skills/resources with specific acquisition plans
- Semester-Long Needs: 1 pt T + 5 pts E - Scaling needs with budgets/timelines
- Acquisition Plan: 0.5 pt T + 3 pts E - Week-by-week skill building plan
- Gaps and Risks: 0.5 pt T + 2 pts E - Identified gaps with mitigation strategies

### 6. Self-Assessment (2 pts Thoroughness MAX, 5 pts Viability MAX)
- Path to Enterprise Value: 1 pt T + 3 pts V - Clear math to $1M+ valuation
- Kill Criteria: 1 pt T + 2 pts V - Specific, measurable thresholds for pivot/kill

### 7. Financial Projections (4 pts Thoroughness MAX, 7 pts Viability MAX)
- Revenue Model: 1 pt T + 2 pts V - Sources, pricing strategy, LTV calculation
- Cost Structure: 1 pt T + 1 pt V - Fixed/variable breakdown with budgets
- Projections: 1 pt T + 2 pts V - Monthly cash flow, break-even analysis
- Justification: 1 pt T + 2 pts V - Assumptions, sensitivity analysis, risks

### 8. Risks, Mitigation, and Contingencies (3 pts Thoroughness MAX, 10 pts Executability MAX)
- Top 3-5 Risks: 1 pt T + 2 pts E - Prioritized by impact/probability
- Mitigation Strategies: 1 pt T + 3 pts E - Specific, actionable strategies per risk
- Contingency Plans: 0.5 pt T + 3 pts E - Backup scenarios with triggers
- Kill Criteria: 0.5 pt T + 2 pts E - Hard kill, soft pivot, success thresholds

### 9. Appendix (5 pts Thoroughness MAX)
- Research Sources: 2 pts - 5+ credible, annotated links
- Early Artifacts: 2 pts - Prototypes, landing pages, customer feedback, social proof
- Pitch Notes: 1 pt - Opening hook, proof points, objection handling, specific ask
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
