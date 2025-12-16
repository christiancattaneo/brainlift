import { BrainliftSection, SectionGrade, SECTIONS_CONFIG, TractionEvidence, MilestoneBonus, MILESTONE_CONFIG, TRACTION_CONFIG, TractionType, MilestoneType } from '@/types';

/**
 * YC PRINCIPLES - Embedded wisdom from YC partners for evaluating startups
 * Source: Paul Graham essays, YC Startup School, partner interviews
 */
export const YC_PRINCIPLES = `
## YC EVALUATION PRINCIPLES

**Founder Evaluation**
- Do they understand their users deeply? (Pain points, not just demographics)
- Are they building something they themselves need/understand?
- Do they have unfair advantages? (Skills, access, domain insight)
- Do they move fast and learn from feedback?

**Idea Evaluation**
- Is this a "vitamin" (nice to have) or "painkiller" (must have)?
- Does it solve a problem people actively seek solutions for?
- Is there evidence of organic demand? (People finding them, not just ads)
- Can they start small and expand? (Wedge strategy)

**Market Evaluation**
- Is the market growing? (Surfing a wave vs. fighting currents)
- TAM matters less than having a specific, reachable first audience
- Can they become the default in a niche before expanding?

**Traction Signals**
- Growth rate > absolute numbers (10% week-over-week is strong)
- Retention > acquisition (users coming back?)
- Organic growth signals (word of mouth, referrals)
- Revenue > users > signups > interest (hierarchy of evidence)

**Execution Markers**
- Specific next steps that could happen THIS WEEK
- Clear, measurable milestones with deadlines
- Honest kill criteria (intellectual honesty is crucial)
- Resource-awareness (not assuming money/time they don't have)
`;

/**
 * BUSINESS FRAMEWORKS - First principles validation
 */
export const BUSINESS_FRAMEWORKS = `
## FIRST PRINCIPLES BUSINESS VALIDATION

**Unit Economics Check**
- Customer Acquisition Cost (CAC): How much to get one customer?
- Lifetime Value (LTV): How much does one customer pay over time?
- LTV > 3x CAC is healthy for sustainability
- Payback period: How long to recoup acquisition cost?

**Defensibility Analysis (Porter's Five Forces Simplified)**
- How easy is it to copy this? (Barrier to entry)
- Are you dependent on one platform/API? (Supplier power)
- Can customers easily switch? (Switching costs)
- What else solves this problem? (Substitutes)
- How crowded is this space? (Competition intensity)

**Product-Market Fit Signals**
- Users recommend without being asked
- Users complain when it's down/unavailable
- Users pay without heavy discounting
- Organic growth without constant marketing push

**Lean Validation Questions**
- Is the problem validated with real user research (not assumptions)?
- Does the solution directly address that specific problem?
- Are they measuring metrics that actually matter for success?
- What's the unfair advantage that can't be easily copied?
`;

/**
 * TEEN FOUNDER CALIBRATION - Adjust expectations appropriately
 */
export const TEEN_CALIBRATION = `
## TEEN FOUNDER CONTEXT

**Adjust Expectations For:**
- Time: School, extracurriculars, family obligations (maybe 15-20 hrs/week)
- Resources: Limited capital, no credit history, parent dependencies
- Experience: First-time entrepreneurs, learning as they go
- Legal: Some contracts require adult co-signer, labor restrictions

**What To Reward:**
- Resourcefulness over resources (creative problem-solving)
- Speed of learning over existing knowledge
- Evidence of actual customer contact (even informal conversations)
- Specific, actionable next steps over perfect strategy
- Intellectual honesty about risks and gaps

**Red Flags For Teens Specifically:**
- Plans requiring significant capital they don't have access to
- Timelines assuming full-time availability (ignoring school)
- Dependencies on adults delivering (investors, mentors) without backup
- Overly complex business models that require years of expertise
- No acknowledgment of skill gaps or learning curve
`;

/**
 * EXEMPLAR REFERENCE - Calibration against known-good submission
 */
export const EXEMPLAR_SUMMARY = `
## EXEMPLAR REFERENCE (90+ SCORE CALIBRATION)

A 90+ submission (like "StudySync AI") demonstrates:

**Thoroughness Excellence:**
- Every bolded field has specific, concrete content (no placeholders)
- Numbers with math behind them (not just "we'll grow")
- Specific customer personas with names and details
- Week-by-week breakdown with daily-level specificity where needed

**Viability Excellence:**
- Multiple forms of validation (survey data + waitlist + paying users)
- Clear market sizing with cited sources
- Competitive analysis that shows genuine differentiation
- Financial projections with unit economics that work

**Executability Excellence:**
- 30-day plan is so specific you could hand it to someone else
- Every week has measurable deliverables
- Risk mitigations are specific (not generic "we'll figure it out")
- Kill criteria are honest and measurable
- Tools and resources are named specifically

**Traction Standouts:**
- Actual paying customers (not just interested parties)
- Specific numbers (847 waitlist, 23 paying, $15/month)
- Links to evidence (MVP, landing page, TikTok)
- Testimonials from real users

Use this as calibration: Does the current submission approach this level of specificity and evidence?
`;

export const RUBRIC = `
# BUSINESS BRAINLIFT GRADING RUBRIC

## Grading Categories
- **Thoroughness & Coherence (30 points total)**: Depth, completeness, AND internal consistency. A thorough plan is complete, specific, AND coherent with all other sections.
- **Viability (30 points total)**: Proof of real business potential with data-backed claims
- **Executability (40 points total)**: Actionable, realistic plans that teens can execute

## Pass Threshold: 80% (80/100 points)

## CRITICAL INSTRUCTION:
You MUST NOT exceed the maximum points for any category. Scores are CAPPED at the maximum shown.
If content deserves more than the max, still award ONLY the max.

## COHERENCE RULE:
If a section contradicts or is inconsistent with claims made in other sections, DEDUCT from Thoroughness.
- Major contradiction (different numbers, conflicting claims): -1 to -2 pts from Thoroughness
- Minor inconsistency (slight misalignment): -0.5 pts from Thoroughness

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

/**
 * Extract key claims/metrics from all sections for cross-reference
 */
export function buildClaimsExtractionPrompt(fullContent: string): string {
  return `You are analyzing a Business Brainlift to extract KEY CLAIMS and METRICS that should be consistent across all sections.

## CONTENT:
${fullContent}

## EXTRACT THE FOLLOWING (if mentioned):
1. **Revenue targets** - Any revenue/MRR numbers mentioned
2. **User/customer numbers** - Paying users, waitlist, targets
3. **Pricing** - Subscription costs, one-time fees
4. **Timeline milestones** - Key dates/weeks/months for goals
5. **Costs/budget** - Spending amounts, tool costs
6. **Target market** - Who they're selling to
7. **Business model** - How they make money
8. **Growth targets** - MoM growth, conversion rates

## RESPONSE FORMAT (JSON only):
{
  "claims": {
    "revenue": ["$10k MRR by Month 4", "$5k total revenue"],
    "users": ["50 users Week 4", "500 subscribers semester end"],
    "pricing": ["$20/month subscription"],
    "timeline": ["MVP by Week 2", "50 users by Feb 1"],
    "costs": ["$2k API credits", "$500/month marketing"],
    "targetMarket": ["high school AP students", "14-18 year olds"],
    "businessModel": ["B2C subscription", "premium packs"],
    "growth": ["30% MoM growth", "85% retention"]
  }
}

Only include claims that are EXPLICITLY stated. Use empty arrays [] for categories with no claims.
Respond with ONLY the JSON object.`;
}

export function buildGradingPrompt(section: BrainliftSection, crossSectionClaims?: string): string {
  const config = SECTIONS_CONFIG.find(s => s.id === section.id);
  
  const contextBlock = crossSectionClaims ? `
## CROSS-SECTION CONTEXT (Claims from other sections - check for consistency):
${crossSectionClaims}

IMPORTANT: If this section contradicts or misaligns with claims above, DEDUCT from Thoroughness score and note in coherenceIssues.
` : '';
  
  return `You are an expert entrepreneurship mentor grading a teen founder's Business Brainlift submission.

${YC_PRINCIPLES}

${BUSINESS_FRAMEWORKS}

${TEEN_CALIBRATION}

${RUBRIC}

${EXEMPLAR_SUMMARY}

## YOUR TASK
Grade the following section: "${section.title}"

MAXIMUM points for this section (DO NOT EXCEED):
- Thoroughness & Coherence: ${config?.thoroughnessMax || 0} points MAX
- Viability: ${config?.viabilityMax || 0} points MAX
- Executability: ${config?.executabilityMax || 0} points MAX
${contextBlock}
## SECTION CONTENT:
${section.content}

## GRADING METHODOLOGY
Apply this multi-lens evaluation:

**1. VC Lens (for Viability):** Would an investor bet on this? Is the market real? Is there defensibility?
**2. Operator Lens (for Executability):** Can this teen actually execute this plan in the stated timeframe?
**3. Mentor Lens (for Thoroughness):** Has the student done the thinking? Is the plan complete and coherent?

## CRITICAL INSTRUCTIONS
1. NEVER exceed the maximum points for any category
2. Apply YC principles: Is this a painkiller or vitamin? Is there real evidence of demand?
3. Consider teen context: Adjust for time/resource constraints, but still expect specificity
4. Calibrate against the exemplar: Does this approach that level of detail and evidence?
5. Award partial points where appropriate (e.g., 0.5, 1.5, 2.5)
6. **CHECK FOR EMPTY FIELDS** - Bolded headers with NO content are INCOMPLETE. Heavily penalize thoroughness.
7. **CHECK FOR COHERENCE** - If claims here contradict other sections, deduct from Thoroughness.
8. **VERIFY CLAIMS** - Distinguish between verified (with evidence), plausible (reasonable), and questionable (inflated) claims.

## RESPONSE FORMAT (JSON only, no markdown):
{
  "thoroughnessScore": <number, max ${config?.thoroughnessMax || 0}>,
  "viabilityScore": <number, max ${config?.viabilityMax || 0}>,
  "executabilityScore": <number, max ${config?.executabilityMax || 0}>,
  "analysis": "<2-3 sentence overall assessment applying YC/business principles>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<specific, actionable improvement 1>", "<specific, actionable improvement 2>"],
  "emptyFields": [
    {"fieldName": "<name of empty bolded field>", "expectedContent": "<what should be there>"}
  ],
  "coherenceIssues": [
    {"issue": "<description of contradiction/inconsistency>", "severity": "<high|medium|low>", "deduction": <points deducted from thoroughness>}
  ],
  "claimVerification": {
    "verified": ["<claim with evidence>"],
    "plausible": ["<reasonable but unverified claim>"],
    "questionable": ["<claim that seems inflated or unrealistic>"]
  }
}

Notes:
- emptyFields should be [] if all bolded fields have content
- coherenceIssues should be [] if section is consistent with other sections
- claimVerification helps track evidence quality

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
 * Format extracted claims for inclusion in grading prompts
 */
export function formatClaimsForContext(claims: Record<string, string[]>): string {
  const lines: string[] = [];
  
  if (claims.revenue?.length) lines.push(`Revenue: ${claims.revenue.join(', ')}`);
  if (claims.users?.length) lines.push(`Users/Customers: ${claims.users.join(', ')}`);
  if (claims.pricing?.length) lines.push(`Pricing: ${claims.pricing.join(', ')}`);
  if (claims.timeline?.length) lines.push(`Timeline: ${claims.timeline.join(', ')}`);
  if (claims.costs?.length) lines.push(`Costs: ${claims.costs.join(', ')}`);
  if (claims.targetMarket?.length) lines.push(`Target Market: ${claims.targetMarket.join(', ')}`);
  if (claims.businessModel?.length) lines.push(`Business Model: ${claims.businessModel.join(', ')}`);
  if (claims.growth?.length) lines.push(`Growth: ${claims.growth.join(', ')}`);
  
  return lines.length > 0 ? lines.join('\n') : 'No cross-section claims extracted.';
}

/**
 * Calculate bonus points from traction evidence
 * DEDUPLICATION: Only count each traction type ONCE (take the best instance if verified)
 */
export function calculateTractionBonus(traction: TractionEvidence[]): number {
  // Dedupe by type - keep best instance (verified > unverified)
  const bestByType = new Map<TractionType, TractionEvidence>();
  
  for (const t of traction) {
    const existing = bestByType.get(t.type);
    if (!existing || (t.verified && !existing.verified)) {
      bestByType.set(t.type, t);
    }
  }
  
  let bonus = 0;
  for (const t of bestByType.values()) {
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

/**
 * Aggregate coherence issues from all sections
 */
export function aggregateCoherenceIssues(grades: SectionGrade[]): { 
  totalDeduction: number; 
  issues: Array<{ section: string; issue: string; severity: string; deduction: number }> 
} {
  const allIssues: Array<{ section: string; issue: string; severity: string; deduction: number }> = [];
  let totalDeduction = 0;
  
  for (const grade of grades) {
    if (grade.coherenceIssues) {
      for (const ci of grade.coherenceIssues) {
        allIssues.push({
          section: grade.sectionTitle,
          issue: ci.issue,
          severity: ci.severity,
          deduction: ci.deduction,
        });
        totalDeduction += ci.deduction;
      }
    }
  }
  
  return { totalDeduction, issues: allIssues };
}

/**
 * Build a critique prompt for self-verification of grades
 * This implements "Chain of Verification" - a second pass to catch errors
 */
export function buildCritiquePrompt(
  section: BrainliftSection,
  initialGrade: SectionGrade,
  crossSectionClaims?: string
): string {
  const config = SECTIONS_CONFIG.find(s => s.id === section.id);
  
  return `You are a CRITICAL REVIEWER auditing an AI grading assessment. Your job is to find errors, biases, and oversights.

## INITIAL GRADE GIVEN:
- Section: ${section.title}
- Thoroughness: ${initialGrade.thoroughnessScore}/${initialGrade.thoroughnessMax}
- Viability: ${initialGrade.viabilityScore}/${initialGrade.viabilityMax}
- Executability: ${initialGrade.executabilityScore}/${initialGrade.executabilityMax}
- Analysis: ${initialGrade.analysis}
- Strengths: ${JSON.stringify(initialGrade.strengths)}
- Improvements: ${JSON.stringify(initialGrade.improvements)}

## SECTION CONTENT:
${section.content}

${crossSectionClaims ? `## CROSS-SECTION CONTEXT:\n${crossSectionClaims}` : ''}

## YOUR CRITICAL REVIEW TASK

**1. Check for Over-Generosity:**
- Did the grader give points for vague statements that lack specifics?
- Did they accept claims without evidence?
- Were they too lenient on empty or incomplete fields?
- Did they grade on potential rather than what's actually there?

**2. Check for Over-Harshness:**
- Did the grader miss genuine strengths?
- Were they unfair to a teen founder's resource constraints?
- Did they penalize for things not required by the rubric?

**3. Verify Specific Claims:**
For each specific number or claim in the submission:
- Is it backed by evidence/links?
- Is it realistic for a teen founder?
- Does it contradict other parts of the plan?

**4. Check Grading Consistency:**
- Does the score match the analysis? (High praise but low score = error)
- Are the improvements actionable and specific?
- Were all rubric criteria actually addressed?

## RESPONSE FORMAT (JSON only):
{
  "originalScoreJustified": <true/false>,
  "recommendedAdjustments": {
    "thoroughness": <adjustment: -2 to +2>,
    "viability": <adjustment: -2 to +2>,
    "executability": <adjustment: -2 to +2>
  },
  "critiques": [
    "<specific issue with the original grading>"
  ],
  "missedStrengths": ["<strength the grader overlooked>"],
  "missedWeaknesses": ["<weakness the grader overlooked>"],
  "claimAudit": [
    {"claim": "<specific claim>", "status": "<verified|plausible|questionable|contradicted>", "reason": "<why>"}
  ],
  "revisedAnalysis": "<2-3 sentence revised assessment if changes warranted>"
}

Be rigorous but fair. The goal is accuracy, not harshness.
Respond with ONLY the JSON object, no additional text.`;
}

/**
 * Build a multi-expert lens prompt for deeper analysis
 */
export function buildExpertLensPrompt(
  section: BrainliftSection,
  lens: 'vc' | 'operator' | 'mentor',
  crossSectionClaims?: string
): string {
  const config = SECTIONS_CONFIG.find(s => s.id === section.id);
  
  const lensDescriptions = {
    vc: {
      role: 'a YC partner evaluating this for seed funding',
      focus: 'Market opportunity, defensibility, growth potential, founder-market fit',
      keyQuestion: 'Would you bet $150k on this team and idea?',
      scoreWeights: 'Prioritize Viability scoring'
    },
    operator: {
      role: 'a serial entrepreneur who has built 3 successful businesses',
      focus: 'Realistic timelines, resource requirements, execution bottlenecks, what could go wrong',
      keyQuestion: 'Can this specific teen actually execute this plan in 30 days with their constraints?',
      scoreWeights: 'Prioritize Executability scoring'
    },
    mentor: {
      role: 'an experienced startup mentor reviewing a student\'s work',
      focus: 'Completeness, logical flow, internal consistency, evidence of deep thinking',
      keyQuestion: 'Does this plan show the student has done genuine strategic thinking?',
      scoreWeights: 'Prioritize Thoroughness scoring'
    }
  };
  
  const lensConfig = lensDescriptions[lens];
  
  return `You are ${lensConfig.role}.

${RUBRIC}

## YOUR EXPERT LENS
**Focus:** ${lensConfig.focus}
**Key Question:** ${lensConfig.keyQuestion}
**Scoring Priority:** ${lensConfig.scoreWeights}

## SECTION TO EVALUATE: "${section.title}"
${section.content}

${crossSectionClaims ? `## CONTEXT FROM OTHER SECTIONS:\n${crossSectionClaims}` : ''}

## MAXIMUM SCORES (DO NOT EXCEED):
- Thoroughness: ${config?.thoroughnessMax || 0} points
- Viability: ${config?.viabilityMax || 0} points  
- Executability: ${config?.executabilityMax || 0} points

## YOUR EVALUATION
From your expert perspective (${lens.toUpperCase()} LENS), evaluate this section.

{
  "lens": "${lens}",
  "thoroughnessScore": <number>,
  "viabilityScore": <number>,
  "executabilityScore": <number>,
  "keyInsight": "<most important observation from your expert perspective>",
  "concerns": ["<concern 1>", "<concern 2>"],
  "strengths": ["<strength 1>", "<strength 2>"]
}

Respond with ONLY the JSON object.`;
}

/**
 * Synthesize multiple expert lens evaluations into final grade
 */
export function buildSynthesisPrompt(
  section: BrainliftSection,
  vcGrade: Record<string, unknown>,
  operatorGrade: Record<string, unknown>,
  mentorGrade: Record<string, unknown>
): string {
  const config = SECTIONS_CONFIG.find(s => s.id === section.id);
  
  return `You are synthesizing three expert evaluations into a final grade.

## SECTION: "${section.title}"

## VC PERSPECTIVE:
${JSON.stringify(vcGrade, null, 2)}

## OPERATOR PERSPECTIVE:
${JSON.stringify(operatorGrade, null, 2)}

## MENTOR PERSPECTIVE:
${JSON.stringify(mentorGrade, null, 2)}

## SYNTHESIS RULES:
1. Where all three agree: High confidence in that score
2. Where they disagree: Investigate why and choose the most appropriate
3. Weight scores based on what matters most for this section type:
   - Strategic sections → Mentor weight higher
   - Market/Financial sections → VC weight higher
   - Execution/30-day sections → Operator weight higher

## MAXIMUM SCORES (DO NOT EXCEED):
- Thoroughness: ${config?.thoroughnessMax || 0}
- Viability: ${config?.viabilityMax || 0}
- Executability: ${config?.executabilityMax || 0}

## RESPONSE FORMAT:
{
  "finalThoroughnessScore": <number>,
  "finalViabilityScore": <number>,
  "finalExecutabilityScore": <number>,
  "consensusAreas": ["<where experts agreed>"],
  "divergenceAreas": ["<where experts disagreed and how you resolved>"],
  "synthesizedAnalysis": "<2-3 sentence balanced assessment>",
  "topStrengths": ["<strength 1>", "<strength 2>"],
  "topImprovements": ["<improvement 1>", "<improvement 2>"]
}

Respond with ONLY the JSON object.`;
}
