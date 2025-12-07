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

export type MarketCompetitor = {
  name: string;
  type: string;              // e.g. "direct", "indirect", "alternative"
  description: string;
  strengths: string[];
  weaknesses: string[];
  pricingSummary?: string;
  keyFeatures?: string[];
};

export type MarketAnalysisData = {
  marketOverview: {
    segment: string;         // e.g. "AI tools for solo founders"
    sizeDescription: string; // qualitative (e.g. "growing, early-stage niche")
    trends: string[];        // key trends impacting this idea
  };
  idealCustomerProfile: {
    description: string;
    mainPainPoints: string[];
    mainGoals: string[];
  };
  competitors: MarketCompetitor[];
  positioningGaps: {
    gapDescription: string;   // what competitors miss
    opportunity: string;      // how the user can exploit it
  }[];
  recommendedPositioning: {
    oneLiner: string;         // short positioning sentence
    narrative: string;        // 1–2 paragraph explanation
    keyDifferentiators: string[];
  };
};

export type PitchDeckSlideType =
  | "title"
  | "problem"
  | "solution"
  | "market"
  | "product"
  | "business_model"
  | "traction"
  | "competition"
  | "go_to_market"
  | "team"
  | "financials"
  | "ask"
  | "roadmap"
  | "closing"
  | "custom";

export type PitchDeckSlide = {
  id: string;              // unique id, e.g. "slide-1"
  type: PitchDeckSlideType;
  title: string;           // slide title
  subtitle?: string;
  bullets: string[];       // 3–6 bullet points
  speakerNotes?: string;   // a short paragraph for presenter notes
};

export type PitchDeckData = {
  titleSlide: {
    startupName: string;
    tagline: string;
    oneLiner: string;
  };
  slides: PitchDeckSlide[];
  overallNarrative: string;  // 1–2 paragraph narrative connecting the story
  investorFitNote?: string;  // suggestions for who this is a good fit for
};

export type FundingStrategy =
  | "bootstrapping"
  | "angel"
  | "accelerator"
  | "vc"
  | "grant"
  | "not_recommended_yet";

export type FundingRoadmapData = {
  shouldRaiseNow: boolean;
  recommendedStrategy: FundingStrategy;
  reasoning: string;

  prerequisites: {
    description: string;
    checklist: string[];
  };

  plan30Days: {
    focus: string;
    tasks: string[];
  };

  plan90Days: {
    focus: string;
    tasks: string[];
  };

  recommendedAsk: {
    amountRange: string;        // e.g. "$50k–$150k"
    runwayMonths: number;       // e.g. 6
    useOfFunds: { label: string; percent: number; }[];
  };

  risks: string[];              // list of fundraising risks/blockers
};
