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
    phase: string;
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

export type BrandingKitData = {
  brandEssence: {
    coreIdea: string;
    personality: string;
    toneOfVoice: string;
  };
  visualDirection: {
    colorPalette: {
      name: string;
      hex: string;
      usage: string;
    }[];
    typography: {
      role: string;
      suggestion: string;
      styleNote: string;
    }[];
  };
  messaging: {
    tagline: string;
    shortDescription: string;
    elevatorPitch: string;
    valueProposition: string;
  };
  heroSection: {
    headline: string;
    subheadline: string;
    primaryCTA: string;
    secondaryCTA: string;
  };
  brandDoDont: {
    do: string[];
    dont: string[];
  };
};

export type LandingPagePlanData = {
  hero: {
    headline: string;
    subheadline: string;
    primaryCTA: string;
    secondaryCTA?: string;
    keyBenefits: string[];
  };
  sections: {
    id: string;
    type: "features" | "problem-solution" | "how-it-works" | "testimonial" | "pricing" | "faq" | "trust" | "cta" | "custom";
    title: string;
    subtitle?: string;
    body?: string;
    bulletPoints?: string[];
  }[];
  layoutNotes: {
    generalStyle: string;
    suggestedStructure: string;
    aboveTheFoldFocus: string;
  };
  seo: {
    targetKeyword: string;
    metaTitle: string;
    metaDescription: string;
  };
};

export type ExecutionTask = {
  id: string;
  title: string;
  description: string;
  category: "validation" | "marketing" | "product" | "branding" | "landing_page" | "research" | "setup" | "other";
  priority: "high" | "medium" | "low";
  estimatedTimeMinutes: number;
  suggestedTools: string[];
};

export type ExecutionCoachResponse = {
  focusSummary: string;
  tasks: ExecutionTask[];
};
