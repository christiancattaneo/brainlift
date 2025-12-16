# Advanced Grading Architecture: Getting Closer to Truth

## Overview

This document outlines a multi-layer approach to improve grading accuracy beyond single LLM calls. The goal is to replicate how expert human mentors would evaluate a teen founder's business plan.

---

## Current Architecture (v1)

```
[Sections] → [Claims Extraction] → [Section Grading] → [Traction Analysis] → [Summary]
```

**Limitations:**
- Single perspective per section
- No self-verification
- No calibration against known-good examples
- Missing structured business frameworks

---

## Proposed Architecture (v2): Multi-Layer Truth System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LAYER 1: KNOWLEDGE INJECTION                       │
│  Expert Frameworks + YC Principles + First Principles Business Validation   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LAYER 2: MULTI-EXPERT ANALYSIS                        │
│     VC Lens → Operator Lens → Mentor Lens → Synthesize                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LAYER 3: CHAIN OF VERIFICATION                          │
│          Grade → Critique → Verify Claims → Revise                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LAYER 4: BENCHMARK CALIBRATION                         │
│       Compare Against Exemplar → Adjust for Teen Context                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## LAYER 1: Knowledge Injection

### 1.1 YC Principles (Embedded in Prompts)

```markdown
## YC EVALUATION FRAMEWORK
Apply these Paul Graham / YC principles when evaluating:

**The Founders**
- Do they understand their users deeply? (Not just demographics—pain points)
- Are they building something they themselves need/understand?
- Do they have unfair advantages (skills, access, insight)?

**The Idea**  
- Is this a "vitamin" (nice to have) or "painkiller" (must have)?
- Does it solve a real problem people will pay for?
- Is there evidence of organic demand (people seeking this out)?

**Market**
- Is the market growing? (Surfing a wave vs. fighting currents)
- Is there a wedge to enter? (Can they start small and expand?)
- TAM matters less than having a specific, reachable first audience

**Traction**
- Any evidence of momentum? (Users, revenue, waitlist)
- Growth rate > absolute numbers (10% week-over-week is strong)
- Are users coming back? (Retention > acquisition)

**Execution**
- Is the plan specific enough to execute THIS WEEK?
- Are milestones measurable and time-bound?
- Do they have clear kill criteria (intellectual honesty)?
```

### 1.2 Business School Frameworks

```markdown
## FIRST PRINCIPLES BUSINESS VALIDATION

**Porter's Five Forces (Simplified for Teens)**
- Threat of new entrants: How easy is it to copy this?
- Supplier power: Are you dependent on one platform/API?
- Buyer power: Can customers easily switch?
- Substitutes: What else solves this problem?
- Rivalry: How crowded is this space?

**Lean Canvas Validation Points**
- Problem: Is it validated with real user research?
- Solution: Does it directly address the problem?
- Key Metrics: Are they measuring what matters?
- Unfair Advantage: What can't be copied?
- Channels: How will they actually reach customers?
- Cost/Revenue: Do the unit economics work?

**Product-Market Fit Signals**
- Users recommend without being asked
- Users complain when it's down
- Users pay without heavy discounting
- Organic growth (not just paid acquisition)
```

### 1.3 Teen Founder Context Calibration

```markdown
## TEEN FOUNDER CALIBRATION

Adjust expectations for these realities:
- Time constraints: School, extracurriculars, family obligations
- Resource constraints: Limited capital, no credit history
- Experience constraints: First-time entrepreneurs
- Legal constraints: Can't sign certain contracts, limited work hours

**What to reward:**
- Resourcefulness over resources
- Speed of learning over existing knowledge
- Evidence of customer contact (even informal)
- Specific next steps over perfect strategy

**Red flags for teens specifically:**
- Plans requiring significant capital they don't have
- Timelines assuming full-time availability
- Dependencies on adults delivering (investors, mentors)
- Overly complex business models
```

---

## LAYER 2: Multi-Expert Analysis

### Concept
Instead of one grading pass, run 3 parallel expert "lenses":

### 2.1 The VC Lens (Viability Focus)
```
"You are a YC partner evaluating this business for seed funding.
Focus on: Market opportunity, defensibility, growth potential, founder-market fit.
Key question: Would you bet $150k on this team/idea?"
```

### 2.2 The Operator Lens (Executability Focus)  
```
"You are a serial entrepreneur who has built 3 businesses.
Focus on: Realistic timelines, resource requirements, execution bottlenecks.
Key question: Can this specific teen execute this plan in 30 days?"
```

### 2.3 The Mentor Lens (Thoroughness Focus)
```
"You are an experienced startup mentor reviewing a student's work.
Focus on: Completeness, logical flow, internal consistency, learning potential.
Key question: Does this plan show the student has done the thinking?"
```

### 2.4 Synthesis
```
Take the three expert evaluations and synthesize:
- Where do they agree? (High confidence)
- Where do they disagree? (Needs deeper look)
- Weighted average based on which lens matters most for each dimension
```

---

## LAYER 3: Chain of Verification

### 3.1 Initial Grade
```
Standard grading with rubric → Score + Analysis
```

### 3.2 Critique Pass
```
"You are a critical reviewer. Look at this grade and find:
1. Where might the grader have been too generous?
2. Where might they have been too harsh?
3. What claims in the submission weren't actually verified?
4. What context might the grader have missed?"
```

### 3.3 Claim Verification
```
"For each specific claim in the submission, rate:
- VERIFIED: Evidence provided (link, data, specifics)
- PLAUSIBLE: Reasonable but unverified
- QUESTIONABLE: Seems inflated or unrealistic
- CONTRADICTED: Conflicts with other parts of the plan"
```

### 3.4 Revised Grade
```
"Based on the critique and verification, provide a revised grade.
Explain any changes from the initial assessment."
```

---

## LAYER 4: Benchmark Calibration

### 4.1 Exemplar Comparison
Use the StudySync AI exemplar as a calibration reference:

```
"Here is an EXEMPLAR submission that would score 90+/100:
[Insert exemplar summary]

Compare the current submission against this exemplar:
- What does the exemplar do that this submission is missing?
- Where does this submission match or exceed the exemplar?
- Calibrate your scores accordingly."
```

### 4.2 Teen Context Adjustment
```
"Final adjustment for teen founder context:
- Is this achievable for a 14-18 year old with school commitments?
- Are the skills required learnable in the timeframe?
- Are the resources required accessible to a teen?"
```

---

## Implementation Priority

### Phase 1: Quick Wins (Low effort, High impact)
1. **Inject YC principles into existing prompts** ✅ Easy
2. **Add exemplar reference to grading prompt** ✅ Easy
3. **Add critique/verification pass after initial grade** ⚡ Medium

### Phase 2: Multi-Expert (Medium effort, High impact)
4. **Implement 3-lens parallel grading** 
5. **Build synthesis logic**

### Phase 3: Advanced (Higher effort, Highest accuracy)
6. **Claim verification with evidence scoring**
7. **Multi-model ensemble (Claude + GPT-4 + Gemini)**
8. **Historical calibration from real grades**

---

## Cost/Latency Considerations

| Approach | LLM Calls | Est. Cost | Added Latency |
|----------|-----------|-----------|---------------|
| Current | 9 + 3 = 12 | ~$0.30 | Baseline |
| + Knowledge injection | 12 | ~$0.35 | +0% |
| + Critique pass | 12 + 9 = 21 | ~$0.55 | +50% |
| + Multi-expert | 12 + 27 = 39 | ~$0.95 | +100% |
| Full architecture | ~50 | ~$1.20 | +150% |

**Recommendation:** Start with knowledge injection + single critique pass. This gets 80% of the benefit for 20% additional cost.

---

## Technical Implementation

### New Prompt Functions Needed

```typescript
// grading.ts additions

export function buildExpertLensPrompt(
  section: BrainliftSection, 
  lens: 'vc' | 'operator' | 'mentor',
  crossSectionClaims?: string
): string;

export function buildCritiquePrompt(
  section: BrainliftSection,
  initialGrade: SectionGrade
): string;

export function buildVerificationPrompt(
  claims: string[],
  submissionContent: string
): string;

export function buildCalibrationPrompt(
  grade: SectionGrade,
  exemplarReference: string
): string;
```

### New API Flow

```typescript
// route.ts additions

// 1. Extract claims (existing)
// 2. For each section:
//    a. Initial grade with knowledge-injected prompt
//    b. Critique pass
//    c. Synthesize final grade
// 3. Traction analysis (existing)
// 4. Benchmark calibration
// 5. Final summary
```

---

## Metrics for Success

Track these to validate improvements:
1. **Consistency:** Same submission → similar scores across runs
2. **Expert alignment:** Compare AI grades to human mentor grades
3. **Actionability:** Are recommendations more specific?
4. **False positives:** Plans that passed but shouldn't have
5. **False negatives:** Plans that failed but had merit

---

## Next Steps

1. Review this architecture
2. Decide on implementation phases
3. Start with Phase 1 (knowledge injection + critique)
4. Measure improvement before Phase 2

