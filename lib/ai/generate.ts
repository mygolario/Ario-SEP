import { IdeaInput, StartupPlan } from '@/lib/types';

export async function generateStrategyMap(input: IdeaInput): Promise<StartupPlan> {
  const {
    ideaTitle,
    ideaDescription,
    targetAudience,
    budgetLevel,
    experienceLevel,
    timePerWeek,
  } = input;

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o-mini' // or any other capable model on OpenRouter
    : 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `You are an AI startup execution planner. Based on the user's idea and constraints, generate a one-page startup execution strategy in this exact JSON format:
{
  "summary": {
    "title": "string",
    "elevatorPitch": "string",
    "coreGoal": "string"
  },
  "keyBlocks": [
    { "label": "string", "content": "string" }
  ],
  "roadmap": [
    { "label": "string", "items": ["string"] }
  ],
  "notes": ["string"]
}
Ensure the JSON is valid and strictly follows this structure. Do not include markdown code blocks.`;

  const userPrompt = `
Idea: ${ideaTitle}
Description: ${ideaDescription}
Target Audience: ${targetAudience}
Budget: ${budgetLevel}
Experience: ${experienceLevel}
Time Commitment: ${timePerWeek ? `${timePerWeek} hours/week` : 'Flexible'}

Generate a strategy map with:
1. A summary section.
2. Key blocks including strictly these labels: "Problem", "Solution", "Value Proposition", "Monetization", "Channels".
3. A 7-14 day execution roadmap broken into 3-4 distinct time blocks (e.g. Day 1-2, Day 3-5).
4. Any critical tips or warnings in notes.
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
    throw new Error(errorData.error?.message || 'Failed to generate plan from AI provider');
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
