import { BrainliftSection, SectionGrade, SECTIONS_CONFIG } from '@/types';

export const RUBRIC = `
# BUSINESS BRAINLIFT GRADING RUBRIC

## Grading Categories
- **Thoroughness (30 points total)**: Depth and completeness of each section
- **Viability (30 points total)**: Proof of real business potential with data-backed claims
- **Executability (40 points total)**: Actionable, realistic plans that teens can execute

## Pass Threshold: 80% (80/100 points)

## Section-by-Section Rubric:

### 1. Strategic Vision (3 pts Thoroughness)
- Business overview (problem, customers): 1 pt - Clearly describes problem (0.5) and target customers with specifics (0.5)
- UVP (defensibility, scalability): 1 pt - Explains unique edge (0.5) and scalability with moats (0.5)
- Why viable (demand evidence): 0.5 pt - Provides market timing/personal fit with evidence
- Self-assessment (enterprise proof or kill): 0.5 pt - Justifies viability with math or explicit kill rationale

### 2. Long-Term Vision (2 pts Thoroughness)
- Year 1 milestones: 0.5 pt - Lists 3-5 specific, phased milestones
- Year 2 milestones: 0.5 pt - Details scaling steps
- Year 3 vision: 0.5 pt - Quantifies size ($X revenue, Y% share)
- Exit strategy: 0.5 pt - Outlines 1-2 paths with rationale

### 3. Semester Targets (2 pts Thoroughness, 3 pts Viability)
- Revenue goal: 1 pt T + 1 pt V - Bold metric with math/assumptions
- Milestones: 0.5 pt T + 1 pt V - 3-4 timed milestones with logical path
- KPIs: 0.5 pt T + 0.5 pt V - 2-3 measurable KPIs
- Dependencies: Integrated into above

### 4. 30-Day Gameplan (3 pts Thoroughness, 15 pts Executability)
- Week 1 Foundation: 0.5 pt T + 2 pts E - 3-5 tasks with timelines/tools
- Week 2 Build/Launch: 0.5 pt T + 3 pts E - Step-by-step build with deadlines
- Week 3 Acquire/Test: 0.5 pt T + 3 pts E - Outreach tactics with scripts/targets
- Week 4 Iterate/Measure: 0.5 pt T + 2 pts E - Analysis steps with pivot readiness
- Subcategories (Product, Marketing, Ops, Financials, Risks): 1 pt T + 5 pts E total

### 5. Market and Competitive Analysis (3 pts Thoroughness, 10 pts Viability)
- Target market: 1 pt T + 3 pts V - Size/segments/personas with quantified TAM
- Trends/opportunity: 1 pt T + 3 pts V - 2-3 trends with sources
- Competitors: 0.5 pt T + 2 pts V - 3-5 listed with SWOT-style analysis
- Validation evidence: 0.5 pt T + 2 pts V - 2-3 proofs (surveys, pre-sales)

### 6. Product/Service Description (4 pts Thoroughness)
- Features/benefits: 1 pt - 4-6 core items with customer benefits
- Roadmap: 1 pt - Short vs. long-term steps, timed
- Business model: 1 pt - Monetization paths with examples
- Stack: 1 pt - Tools/suppliers listed and justified

### 7. Skills and Resources Needed (3 pts Thoroughness, 15 pts Executability)
- 1-Month needs: 1 pt T + 4 pts E - 3-5 skills/resources with immediate acquisition steps
- 4.5-Month needs: 1 pt T + 4 pts E - Scaling needs with budgets/timelines
- Acquisition plan: 0.5 pt T + 4 pts E - How/when details with actionable methods
- Gaps/risks: 0.5 pt T + 3 pts E - Mitigation for 2-3 gaps

### 8. Financial Projections (4 pts Thoroughness, 7 pts Viability)
- Revenue model: 1 pt T + 2 pts V - Sources/pricing, diversified
- Costs: 1 pt T + 1 pt V - Fixed/variable breakdown
- Projections: 1 pt T + 2 pts V - Monthly cash flow, break-even
- Justification: 1 pt T + 2 pts V - Assumptions, sensitivity analysis

### 9. Risks, Mitigation, and Contingencies (3 pts Thoroughness, 10 pts Viability, 10 pts Executability)
- Top risks: 1 pt T + 3 pts V + 2 pts E - 3-5 prioritized risks with impact/timelines
- Strategies: 1 pt T + 3 pts V + 3 pts E - Per-risk mitigations with feasible steps
- Plans: 0.5 pt T + 2 pts V + 3 pts E - Backup scenarios with triggers
- Kill criteria: 0.5 pt T + 2 pts V + 2 pts E - 2-3 measurable thresholds

### 10. Appendix (3 pts Thoroughness)
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

Maximum points for this section:
- Thoroughness: ${config?.thoroughnessMax || 0} points
- Viability: ${config?.viabilityMax || 0} points
- Executability: ${config?.executabilityMax || 0} points

## SECTION CONTENT:
${section.content}

## INSTRUCTIONS
1. Analyze the section against the rubric criteria
2. Be fair but rigorous - this is about validating real business viability
3. Consider that submitters are ambitious teen founders (14-18 years old)
4. Award partial points where appropriate

## RESPONSE FORMAT (JSON only, no markdown):
{
  "thoroughnessScore": <number>,
  "viabilityScore": <number>,
  "executabilityScore": <number>,
  "analysis": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"]
}

Respond with ONLY the JSON object, no additional text.`;
}

export function buildFinalSummaryPrompt(grades: SectionGrade[]): string {
  const gradesJson = JSON.stringify(grades, null, 2);
  
  return `You are an expert entrepreneurship mentor providing final feedback on a Business Brainlift submission.

## SECTION GRADES:
${gradesJson}

## TOTAL CALCULATION:
- Thoroughness: ${grades.reduce((sum, g) => sum + g.thoroughnessScore, 0)}/30
- Viability: ${grades.reduce((sum, g) => sum + g.viabilityScore, 0)}/30
- Executability: ${grades.reduce((sum, g) => sum + g.executabilityScore, 0)}/40
- Total: ${grades.reduce((sum, g) => sum + g.totalScore, 0)}/100
- Pass Threshold: 80%

## INSTRUCTIONS
Provide a final summary that:
1. Gives an overall assessment of the business plan
2. Highlights the strongest aspects
3. Identifies critical areas needing improvement
4. Provides 3-5 actionable top recommendations

## RESPONSE FORMAT (JSON only, no markdown):
{
  "overallAnalysis": "<3-4 sentence comprehensive assessment>",
  "topRecommendations": [
    "<specific, actionable recommendation 1>",
    "<specific, actionable recommendation 2>",
    "<specific, actionable recommendation 3>"
  ]
}

Respond with ONLY the JSON object, no additional text.`;
}

