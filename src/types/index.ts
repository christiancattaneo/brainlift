export interface WorkflowyNode {
  id: string;
  nm?: string; // name/content
  no?: string; // note
  ch?: WorkflowyNode[]; // children
  cp?: number; // completed
}

export interface WorkflowyData {
  projectTreeData?: {
    mainProjectTreeInfo?: {
      rootProject?: WorkflowyNode;
      rootProjectChildren?: WorkflowyNode[];
    };
  };
}

export interface BrainliftSection {
  id: string;
  title: string;
  content: string;
  subsections: BrainliftSubsection[];
}

export interface BrainliftSubsection {
  title: string;
  content: string;
  items: string[];
}

// Empty field detected in a section
export interface EmptyField {
  fieldName: string;
  expectedContent: string;
}

// Coherence issue detected when comparing section to other sections' claims
export interface CoherenceIssue {
  issue: string;
  severity: 'high' | 'medium' | 'low';
  deduction: number; // Points already deducted from thoroughness
}

export interface SectionGrade {
  sectionId: string;
  sectionTitle: string;
  thoroughnessScore: number; // Now includes coherence - "Thoroughness & Coherence"
  thoroughnessMax: number;
  viabilityScore: number;
  viabilityMax: number;
  executabilityScore: number;
  executabilityMax: number;
  totalScore: number;
  totalMax: number;
  analysis: string;
  strengths: string[];
  improvements: string[];
  emptyFields: EmptyField[]; // Fields that are bolded but have no content
  coherenceIssues: CoherenceIssue[]; // Cross-section inconsistencies (deducted from thoroughness)
  status: 'pending' | 'grading' | 'complete' | 'error';
}

// Traction evidence detected in the submission
export interface TractionEvidence {
  type: TractionType;
  description: string;
  value?: number; // e.g., number of users, revenue amount
  verified: boolean; // whether there's proof (links, screenshots mentioned)
}

export type TractionType = 
  | 'paying_customers'
  | 'revenue'
  | 'waitlist_signups'
  | 'mvp_built'
  | 'prototype'
  | 'partnerships'
  | 'loi_signed'
  | 'presales'
  | 'user_feedback'
  | 'pilot_program'
  | 'social_proof'
  | 'press_coverage';

// Bonus points for real progress toward milestones
export interface MilestoneBonus {
  milestone: MilestoneType;
  label: string;
  maxBonus: number;
  earnedBonus: number;
  progressPercent: number; // 0-100+
  evidence: TractionEvidence[];
  color: string;
}

export type MilestoneType = 
  | '30_day'
  | 'semester'
  | 'year_1'
  | 'year_2_3';

// Aggregated coherence summary (from all section grades)
export interface CoherenceSummary {
  totalDeduction: number; // Total points deducted across all sections
  issueCount: number;
  issues: Array<{ section: string; issue: string; severity: string; deduction: number }>;
}

export interface GradingResult {
  // Base plan score (capped at 100)
  sections: SectionGrade[];
  baseScore: number;
  baseMaxScore: number;
  basePercentage: number;
  
  // Traction bonuses (unlimited)
  traction: TractionEvidence[];
  milestones: MilestoneBonus[];
  bonusScore: number;
  
  // Coherence summary (aggregated from section coherenceIssues)
  coherence: CoherenceSummary;
  
  // Combined totals
  totalScore: number;
  maxScore: number; // Always 100 for base
  percentage: number;
  
  // Pass/fail (based on base score only)
  passed: boolean;
  
  overallAnalysis: string;
  topRecommendations: string[];
  timestamp: string;
}

export interface GradingStreamEvent {
  type: 'section_start' | 'section_progress' | 'section_complete' | 'claims_extracted' | 'traction_analysis' | 'final_summary' | 'error';
  sectionId?: string;
  sectionTitle?: string;
  data?: Partial<SectionGrade> | GradingResult | TractionEvidence[] | Record<string, string[]> | string;
  message?: string;
}

// Milestone configuration
export const MILESTONE_CONFIG: Record<MilestoneType, { label: string; maxBonus: number; color: string }> = {
  '30_day': {
    label: '30-Day Progress',
    maxBonus: 15,
    color: '#00FFA3', // Volt Mint
  },
  'semester': {
    label: 'Semester Target',
    maxBonus: 25,
    color: '#00E0FF', // Electric Cyan
  },
  'year_1': {
    label: 'Year 1 Milestone',
    maxBonus: 35,
    color: '#1C1CFF', // Alpha Blue
  },
  'year_2_3': {
    label: 'Long-Term Vision',
    maxBonus: 25,
    color: '#9D4EDD', // Purple
  },
};

// Traction type configuration
export const TRACTION_CONFIG: Record<TractionType, { label: string; basePoints: number; verifiedMultiplier: number }> = {
  'paying_customers': { label: 'Paying Customers', basePoints: 10, verifiedMultiplier: 1.5 },
  'revenue': { label: 'Revenue Generated', basePoints: 15, verifiedMultiplier: 1.5 },
  'waitlist_signups': { label: 'Waitlist/Signups', basePoints: 5, verifiedMultiplier: 1.2 },
  'mvp_built': { label: 'MVP Built', basePoints: 8, verifiedMultiplier: 1.3 },
  'prototype': { label: 'Working Prototype', basePoints: 5, verifiedMultiplier: 1.2 },
  'partnerships': { label: 'Partnerships Secured', basePoints: 7, verifiedMultiplier: 1.4 },
  'loi_signed': { label: 'LOI/Commitment Signed', basePoints: 10, verifiedMultiplier: 1.5 },
  'presales': { label: 'Pre-sales/Deposits', basePoints: 12, verifiedMultiplier: 1.5 },
  'user_feedback': { label: 'User Feedback Collected', basePoints: 4, verifiedMultiplier: 1.2 },
  'pilot_program': { label: 'Pilot Program Running', basePoints: 10, verifiedMultiplier: 1.4 },
  'social_proof': { label: 'Social Proof/Followers', basePoints: 3, verifiedMultiplier: 1.1 },
  'press_coverage': { label: 'Press/Media Coverage', basePoints: 5, verifiedMultiplier: 1.3 },
};

export const SECTIONS_CONFIG = [
  {
    id: 'business-vision-strategy',
    title: 'Business Vision & Strategy',
    thoroughnessMax: 5,
    viabilityMax: 5,
    executabilityMax: 0,
  },
  {
    id: 'market-analysis',
    title: 'Market and Competitive Analysis',
    thoroughnessMax: 3,
    viabilityMax: 10,
    executabilityMax: 0,
  },
  {
    id: 'semester-targets',
    title: 'Semester Targets',
    thoroughnessMax: 2,
    viabilityMax: 3,
    executabilityMax: 0,
  },
  {
    id: '30-day-gameplan',
    title: '30-Day Gameplan',
    thoroughnessMax: 3,
    viabilityMax: 0,
    executabilityMax: 15,
  },
  {
    id: 'skills-resources',
    title: 'Skills and Resources Needed',
    thoroughnessMax: 3,
    viabilityMax: 0,
    executabilityMax: 15,
  },
  {
    id: 'self-assessment',
    title: 'Self-Assessment',
    thoroughnessMax: 2,
    viabilityMax: 5,
    executabilityMax: 0,
  },
  {
    id: 'financial-projections',
    title: 'Financial Projections',
    thoroughnessMax: 4,
    viabilityMax: 7,
    executabilityMax: 0,
  },
  {
    id: 'risks-mitigation',
    title: 'Risks, Mitigation, and Contingencies',
    thoroughnessMax: 3,
    viabilityMax: 0,
    executabilityMax: 10,
  },
  {
    id: 'appendix',
    title: 'Appendix',
    thoroughnessMax: 5,
    viabilityMax: 0,
    executabilityMax: 0,
  },
] as const;

export type SectionId = typeof SECTIONS_CONFIG[number]['id'];
