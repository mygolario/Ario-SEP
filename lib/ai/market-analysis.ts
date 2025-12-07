import { MarketAnalysisData, StartupPlan } from '@/lib/types';

export async function generateMarketAnalysis(
  plan: StartupPlan,
  description: string,
  targetAudience: string
): Promise<MarketAnalysisData> {
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

  const systemPrompt = `You are a startup market strategist. Given a startup idea and its basic plan, produce a market overview and competitor analysis in this exact JSON format:
{
  "marketOverview": {
    "segment": "string",
    "sizeDescription": "string",
    "trends": ["string"]
  },
  "idealCustomerProfile": {
    "description": "string",
    "mainPainPoints": ["string"],
    "mainGoals": ["string"]
  },
  "competitors": [
    {
      "name": "string",
      "type": "string",
      "description": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "pricingSummary": "string",
      "keyFeatures": ["string"]
    }
  ],
  "positioningGaps": [
    { "gapDescription": "string", "opportunity": "string" }
  ],
  "recommendedPositioning": {
    "oneLiner": "string",
    "narrative": "string",
    "keyDifferentiators": ["string"]
  }
}
Ensure the JSON is valid and strictly follows this structure. Competitors can be real or archetypal. Provide 3-5 competitors.`;

  const userPrompt = `
Project Title: ${plan.summary.title}
Core Goal: ${plan.summary.coreGoal}
Description: ${description}
Target Audience: ${targetAudience}

Plan Highlights:
Elevator Pitch: ${plan.summary.elevatorPitch}

Generate a detailed market and competitor analysis tailored to this startup.`;

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
    throw new Error(errorData.error?.message || 'Failed to generate market analysis');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
