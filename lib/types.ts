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

export type DeepPlanData = {
  overview: {
    marketSummary: string;
    mainProblem: string;
    mainOpportunity: string;
  };
  customerSegments: {
    name: string;
    description: string;
    pains: string[];
    gains: string[];
  }[];
  personas: {
    name: string;
    role: string;
    goals: string[];
    frustrations: string[];
  }[];
  competitors: {
    name: string;
    type: string;
    strengths: string[];
    weaknesses: string[];
    differentiation: string;
  }[];
  extendedRoadmap: {
    phase: string;        // e.g. "Weeks 1–2", "Weeks 3–4"
    timeFrame: string;
    items: string[];
  }[];
  monetization: {
    pricingStrategy: string;
    revenueStreams: string[];
    costDrivers: string[];
  };
  goToMarket: {
    channels: string[];
    keyActions: string[];
    first100UsersStrategy: string;
  };
  risks: {
    risk: string;
    impact: string;
    mitigation: string;
  }[];
};
