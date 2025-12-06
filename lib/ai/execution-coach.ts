import { ExecutionCoachResponse } from '@/lib/types';
import { Project, StrategyMap, DeepPlan, BrandingKit, LandingPagePlan } from '@prisma/client';

export async function generateExecutionTasks(
  project: Project,
  strategyMap?: StrategyMap | null,
  deepPlan?: DeepPlan | null,
  brandingKit?: BrandingKit | null,
  landingPagePlan?: LandingPagePlan | null
): Promise<ExecutionCoachResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o'
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `You are an execution-focused startup coach. You give very practical, small, concrete tasks a solo founder can do in the next 1–3 days.
Given the project's strategy, deep plan, branding, and landing page structure, output JSON matching this structure:

type ExecutionTask = {
  id: string;           // random string
  title: string;        // short label
  description: string;  // 1–3 sentences describing how to do it
  category: "validation" | "marketing" | "product" | "branding" | "landing_page" | "research" | "setup" | "other";
  priority: "high" | "medium" | "low";
  estimatedTimeMinutes: number;  // e.g. 15, 30, 60
  suggestedTools: string[];      // e.g. ["Google Forms", "Notion", "Figma"]
};

type ExecutionCoachResponse = {
  focusSummary: string;  // short overview of what the user should focus on right now (max 2 sentences)
  tasks: ExecutionTask[]; // 3-6 tasks
};

Tasks MUST:
- be small and doable (15–60 minutes)
- be specific and non-generic
- be adapted to this project’s current stage
- focus on actions, not ideas.

Return ONLY valid JSON.`;

  const userPrompt = `
Project: ${project.title}
Description: ${project.description}
Audience: ${project.targetAudience}
Stage: ${project.budgetLevel} budget, ${project.experienceLevel} experience.

Status:
- Strategy Map: ${strategyMap ? 'Created' : 'Missing'}
- Deep Plan: ${deepPlan ? 'Created' : 'Missing'}
- Branding Kit: ${brandingKit ? 'Created' : 'Missing'}
- Landing Page Plan: ${landingPagePlan ? 'Created' : 'Missing'}

Generate next next actions.
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
    throw new Error(errorData.error?.message || 'Failed to generate execution tasks');
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
