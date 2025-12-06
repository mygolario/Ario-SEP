export interface StartupPlan {
  summary: {
    title: string;
    elevatorPitch: string;
    coreGoal: string;
  };
  keyBlocks: {
    label: string;
    content: string;
  }[];
  roadmap: {
    label: string;
    items: string[];
  }[];
  notes: string[];
  projectId?: string;
}

export interface IdeaInput {
  ideaTitle: string;
  ideaDescription: string;
  targetAudience: string;
  budgetLevel: 'low' | 'medium' | 'high';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  timePerWeek?: number;
}
