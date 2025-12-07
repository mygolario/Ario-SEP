import { FundingRoadmapData, StartupPlan, DeepPlanData, MarketAnalysisData, BrandingKitData, LandingPagePlanData, PitchDeckData } from '@/lib/types';

export async function generateFundingRoadmap(
  projectData: {
    title: string;
    description: string;
    targetAudience: string;
    plan: StartupPlan | null;
    deepPlan: DeepPlanData | null;
    marketAnalysis: MarketAnalysisData | null;
    brandingKit: BrandingKitData | null;
    landingPage: LandingPagePlanData | null;
    pitchDeck: PitchDeckData | null;
  }
): Promise<FundingRoadmapData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o-mini'
    : 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `You are a startup fundraising strategist. Based on the provided startup information, decide whether the founder should raise money now. If not, explain why and what they need first. Recommend the best funding path (bootstrap, angel, accelerator, VC, grant). Provide a 30-day and 90-day roadmap, plus a recommended funding ask amount in a structured JSON format. ONLY output valid JSON matching FundingRoadmapData structure:
{
  "shouldRaiseNow": boolean,
  "recommendedStrategy": "bootstrapping" | "angel" | "accelerator" | "vc" | "grant" | "not_recommended_yet",
  "reasoning": "string",
  "prerequisites": {
    "description": "string",
    "checklist": ["string"]
  },
  "plan30Days": {
    "focus": "string",
    "tasks": ["string"]
  },
  "plan90Days": {
    "focus": "string",
    "tasks": ["string"]
  },
  "recommendedAsk": {
    "amountRange": "string",
    "runwayMonths": number,
    "useOfFunds": [{ "label": "string", "percent": number }]
  },
  "risks": ["string"]
}

Checklist and tasks should be concrete, tactical, and realistic. Strategy must fit early-stage startups.`;

  const userPrompt = `
Project Title: ${projectData.title}
Description: ${projectData.description}
Target Audience: ${projectData.targetAudience}

Key Plan Data:
${projectData.plan ? `Elevator Pitch: ${projectData.plan.summary.elevatorPitch}` : ''}
${projectData.deepPlan ? `Problem: ${projectData.deepPlan.overview.mainProblem}\nOpportunity: ${projectData.deepPlan.overview.mainOpportunity}` : ''}
${projectData.marketAnalysis ? `Market Segment: ${projectData.marketAnalysis.marketOverview.segment}` : ''}
${projectData.pitchDeck ? `Narrative: ${projectData.pitchDeck.overallNarrative}` : ''}

Generate the funding roadmap.`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(process.env.OPENROUTER_API_KEY && {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Startup Execution Platform',
      }),
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to generate funding roadmap');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
