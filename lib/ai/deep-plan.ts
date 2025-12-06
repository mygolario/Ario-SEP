import { DeepPlanData } from '@/lib/types';
import { Project } from '@prisma/client';

export async function generateDeepPlan(project: Project): Promise<DeepPlanData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o' // Use stronger model for deep plan
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `You are an expert startup strategist. Generate a comprehensive deep strategy plan for the startup described below. Return ONLY valid JSON matching exactly this TypeScript structure:

type DeepPlanData = {
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

Ensure the content is detailed, specific to the startup, and provides actionable strategic insights. Do not include markdown code blocks.`;

  const userPrompt = `
Startup Title: ${project.title}
Description: ${project.description}
Target Audience: ${project.targetAudience}
Budget Level: ${project.budgetLevel}
Experience Level: ${project.experienceLevel}
Time Commitment: ${project.timePerWeekHours ? `${project.timePerWeekHours} hours/week` : 'Flexible'}

Generate the deep strategy plan now.
`;

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
    console.error('AI API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to generate deep plan from AI provider');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('JSON Parse Error:', e);
    throw new Error('Failed to parse AI response');
  }
}
