import { LandingPagePlanData } from '@/lib/types';
import { Project } from '@prisma/client';

export async function generateLandingPagePlan(project: Project, brandingKitData?: any): Promise<LandingPagePlanData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o' // High capability model for structured layout
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `You are a senior conversion-focused copywriter and landing page strategist. You generate structured landing page plans for startups. You MUST return valid JSON only, matching this TypeScript type:

type LandingPagePlanData = {
  hero: {
    headline: string;
    subheadline: string;
    primaryCTA: string;
    secondaryCTA?: string;
    keyBenefits: string[];
  };
  sections: {
    id: string; // unique
    type: "features" | "problem-solution" | "how-it-works" | "testimonial" | "pricing" | "faq" | "trust" | "cta" | "custom";
    title: string;
    subtitle?: string;
    body?: string;
    bulletPoints?: string[];
  }[];
  layoutNotes: {
    generalStyle: string;      // e.g. "clean, modern, high contrast"
    suggestedStructure: string; // overall flow description
    aboveTheFoldFocus: string;
  };
  seo: {
    targetKeyword: string;
    metaTitle: string;
    metaDescription: string;
  };
};

Focus on high conversion, clear messaging, and benefits over features.`;

  const userPrompt = `
Startup Title: ${project.title}
Description: ${project.description}
Target Audience: ${project.targetAudience}

${brandingKitData ? `Brand Tone: ${brandingKitData.brandEssence.toneOfVoice}\nBrand Personality: ${brandingKitData.brandEssence.personality}` : ''}

Generate a high-converting landing page plan.
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
    throw new Error(errorData.error?.message || 'Failed to generate landing page plan from AI provider');
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
