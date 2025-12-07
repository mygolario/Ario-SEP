import { PitchDeckData, StartupPlan, DeepPlanData, MarketAnalysisData, BrandingKitData, LandingPagePlanData } from '@/lib/types';

export async function generatePitchDeck(
  projectData: {
    title: string;
    description: string;
    targetAudience: string;
    plan: StartupPlan | null;
    deepPlan: DeepPlanData | null;
    marketAnalysis: MarketAnalysisData | null;
    brandingKit: BrandingKitData | null;
    landingPage: LandingPagePlanData | null;
  }
): Promise<PitchDeckData> {
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

  const systemPrompt = `You are a senior startup pitch coach and investor. Based on the provided startup data, generate a structured pitch deck outline. Return ONLY valid JSON matching this structure:
{
  "titleSlide": {
    "startupName": "string",
    "tagline": "string",
    "oneLiner": "string"
  },
  "overallNarrative": "string",
  "investorFitNote": "string",
  "slides": [
    {
      "id": "string",
      "type": "title" | "problem" | "solution" | "market" | "product" | "business_model" | "traction" | "competition" | "go_to_market" | "team" | "financials" | "ask" | "roadmap" | "closing" | "custom",
      "title": "string",
      "subtitle": "string",
      "bullets": ["string"],
      "speakerNotes": "string"
    }
  ]
}

The deck should follow standard startup pitch logic: problem, solution, market, product, business model, traction (or validation), competition, go-to-market, team, roadmap, ask, closing.
Use clear, concise, high-signal bullets. Speaker notes should be short and practical. Max 10-15 slides.`;

  const userPrompt = `
Project Title: ${projectData.title}
Description: ${projectData.description}
Target Audience: ${projectData.targetAudience}

Key Plan Data:
${projectData.plan ? `Elevator Pitch: ${projectData.plan.summary.elevatorPitch}` : ''}
${projectData.deepPlan ? `Problem: ${projectData.deepPlan.overview.mainProblem}\nOpportunity: ${projectData.deepPlan.overview.mainOpportunity}` : ''}
${projectData.marketAnalysis ? `Market Segment: ${projectData.marketAnalysis.marketOverview.segment}` : ''}
${projectData.brandingKit ? `Tone: ${projectData.brandingKit.brandEssence.toneOfVoice}\nTagline: ${projectData.brandingKit.messaging.tagline}` : ''}

Generate a comprehensive pitch deck.`;

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
    throw new Error(errorData.error?.message || 'Failed to generate pitch deck');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
