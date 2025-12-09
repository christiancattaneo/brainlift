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

export interface SectionGrade {
  sectionId: string;
  sectionTitle: string;
  thoroughnessScore: number;
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
  status: 'pending' | 'grading' | 'complete' | 'error';
}

export interface GradingResult {
  sections: SectionGrade[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  overallAnalysis: string;
  topRecommendations: string[];
  timestamp: string;
}

export interface GradingStreamEvent {
  type: 'section_start' | 'section_progress' | 'section_complete' | 'final_summary' | 'error';
  sectionId?: string;
  sectionTitle?: string;
  data?: Partial<SectionGrade> | GradingResult | string;
  message?: string;
}

export const SECTIONS_CONFIG = [
  {
    id: 'strategic-vision',
    title: 'Strategic Vision',
    thoroughnessMax: 3,
    viabilityMax: 0,
    executabilityMax: 0,
  },
  {
    id: 'long-term-vision',
    title: 'Long-Term Vision',
    thoroughnessMax: 2,
    viabilityMax: 0,
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
    id: 'market-analysis',
    title: 'Market and Competitive Analysis',
    thoroughnessMax: 3,
    viabilityMax: 10,
    executabilityMax: 0,
  },
  {
    id: 'product-description',
    title: 'Product/Service Description',
    thoroughnessMax: 4,
    viabilityMax: 0,
    executabilityMax: 0,
  },
  {
    id: 'skills-resources',
    title: 'Skills and Resources Needed',
    thoroughnessMax: 3,
    viabilityMax: 0,
    executabilityMax: 15,
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
    viabilityMax: 10,
    executabilityMax: 10,
  },
  {
    id: 'appendix',
    title: 'Appendix',
    thoroughnessMax: 3,
    viabilityMax: 0,
    executabilityMax: 0,
  },
] as const;

export type SectionId = typeof SECTIONS_CONFIG[number]['id'];

