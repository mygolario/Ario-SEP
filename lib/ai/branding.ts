import { BrandingKitData } from '@/lib/types';
import { Project } from '@prisma/client';

export async function generateBrandingKit(project: Project): Promise<BrandingKitData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o' // Use stronger model for creative branding
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `You are a senior brand strategist. Generate a comprehensive branding kit for the startup described below. Return ONLY valid JSON matching exactly this TypeScript structure:

type BrandingKitData = {
  brandEssence: {
    coreIdea: string;
    personality: string;   // e.g. bold, friendly, minimalist
    toneOfVoice: string;   // e.g. confident, playful, expert
  };
  visualDirection: {
    colorPalette: {
      name: string;        // e.g. "Primary", "Accent"
      hex: string;         // e.g. "#FF5733"
      usage: string;       // e.g. "Buttons, CTAs"
    }[];
    typography: {
      role: string;        // e.g. "Headings", "Body"
      suggestion: string;  // e.g. "Inter", "Space Grotesk"
      styleNote: string;   // e.g. "Modern, clean"
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

Ensure the content is creative, aligned with the startup's audience, and provides a cohesive brand identity. Do not include markdown code blocks.`;

  const userPrompt = `
Startup Title: ${project.title}
Description: ${project.description}
Target Audience: ${project.targetAudience}
Budget Level: ${project.budgetLevel}
Experience Level: ${project.experienceLevel}
Time Commitment: ${project.timePerWeekHours ? `${project.timePerWeekHours} hours/week` : 'Flexible'}

Generate the branding kit now.
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
      temperature: 0.8, // Slightly higher for creativity
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('AI API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to generate branding kit from AI provider');
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
