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

export type DeepPlanSection = {
  id: string;
  title: string;
  description: string;
  bullets?: string[];
};

export type DeepPlanData = {
  overview: DeepPlanSection;
  customerAndProblem: DeepPlanSection;
  solutionAndProduct: DeepPlanSection;
  roadmap90Days: DeepPlanSection;
  risks: DeepPlanSection;
  metrics: DeepPlanSection;
};

export type BrandingKitSection = {
  id: string;
  title: string;
  description: string;
  bullets?: string[];
  options?: string[]; // For name suggestions
  keywords?: string[]; // For visual direction
};

export type BrandingColor = {
  name: string;
  hex: string;
  usage: string;
};

export type BrandingKitData = {
  nameAndSlogan: BrandingKitSection;
  personality: BrandingKitSection;
  toneOfVoice: BrandingKitSection;
  brandPromises: BrandingKitSection;
  visualDirection: BrandingKitSection;
  colors: {
    title: string;
    description: string;
    palette: BrandingColor[];
  };
  usageExamples: BrandingKitSection;
};

export type LandingSection = {
  id: string;
  type: string; // "hero" | "problem" | "solution" | "features" | "steps" | "socialProof" | "faq" | "cta"
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  highlightText?: string;
};

export type LandingPlanData = {
  hero: LandingSection;
  problem: LandingSection;
  solution: LandingSection;
  features: LandingSection;
  steps: LandingSection;
  socialProof: LandingSection;
  faq: LandingSection;
  finalCta: LandingSection;
};

export type ExecutionTask = {
  id: string;          // unique id for UI
  title: string;       // عنوان کوتاه تسک (فارسی)
  description?: string; // توضیح کمی عمیق‌تر، فارسی
  category: "تحقیق" | "محصول" | "بازاریابی" | "مالی" | "ذهنیت و نظم شخصی" | string;
  suggestedDuration?: string; // مثلا: "۳۰ تا ۶۰ دقیقه"
  difficulty?: "خیلی سبک" | "متوسط" | "سنگین" | string;
};

export type ExecutionWeek = {
  id: string;
  order: number;
  label: string;       // مثلا: "هفته اول", "هفته دوم", "ماه اول"
  focus: string;       // توضیح کلی تمرکز این هفته
  tasks: ExecutionTask[];
};

export type ExecutionPlanData = {
  summary: {
    title: string;
    description: string; // توضیح کلی درباره رویکرد اجرای قدم‌های اول
  };
  weeks: ExecutionWeek[];
  reminders: string[]; // چند نکته تکراری مهم
};

export type MarketSegment = {
  name: string;
  description: string;
  needs: string[];
};

export type CompetitorRow = {
  name: string;
  type: string;          // "مستقیم" | "غیرمستقیم"
  strengths: string[];
  weaknesses: string[];
};

export type MarketAnalysisData = {
  overview: {
    title: string;
    description: string;
  };
  segments: MarketSegment[];
  layers: {
    overallMarket: string;  // TAM
    targetMarket: string;   // SAM
    reachableMarket: string; // SOM
  };
  competitors: {
    title: string;
    description: string;
    items: CompetitorRow[];
  };
  opportunities: {
    title: string;
    bullets: string[];
  };
  risks: {
    title: string;
    bullets: string[];
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
  order: number;           // slide order
  type: PitchDeckSlideType;
  title: string;           // slide title
  subtitle?: string;
  body?: string;           // main text content
  bullets: string[];       // 3–6 bullet points
  note?: string;           // guide for the presenter
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

export type FundingPhase = {
  id: string;
  order: number;
  title: string;         // فارسی
  timeframe: string;     // مثلاً: "۳ تا ۶ ماه اول"
  goal: string;          // هدف اصلی این مرحله
  amountSummary: string; // توضیح کیفی درباره مقدار پول موردنیاز
  spendCategories: {
    name: string;        // فارسی
    description: string; // فارسی
  }[];
  milestones: string[];  // چند خروجی مهم
  risks?: string[];      // ریسک‌های خاص این مرحله
};

export type FundingPlanData = {
  overallStrategy: {
    title: string;
    description: string; // توضیح کلی درباره رویکرد مالی
  };
  phases: FundingPhase[];
  generalNotes: string[]; // چند نکته کلی درباره مدیریت پول
};
