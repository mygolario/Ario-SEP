import { NextResponse } from 'next/server';
import { IdeaInput, StartupPlan } from '@/lib/types';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body: IdeaInput = await request.json();
    const {
      ideaTitle,
      ideaDescription,
      targetAudience,
      budgetLevel,
      experienceLevel,
      timePerWeek,
    } = body;

    if (!ideaTitle || !ideaDescription || !targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const apiUrl = process.env.OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const model = process.env.OPENROUTER_API_KEY
      ? 'openai/gpt-4o-mini' // or any other capable model on OpenRouter
      : 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: 'Failed to generate plan from AI provider' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let plan: StartupPlan;
    try {
      plan = JSON.parse(content);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Persistence Logic
    let projectId: string | undefined;

    if (session?.user?.id) {
      try {
        const project = await prisma.project.create({
          data: {
            userId: session.user.id,
            title: ideaTitle,
            description: ideaDescription,
            targetAudience: targetAudience,
            budgetLevel: budgetLevel.toUpperCase() as any, // Enum mapping might need case adjustment
            experienceLevel: experienceLevel.toUpperCase() as any,
            timePerWeekHours: timePerWeek,
            strategyMap: {
              create: {
                summary: plan.summary as any, // Prisma Json type
                data: plan as any,
              },
            },
          },
        });
        projectId = project.id;
      } catch (dbError) {
        console.error('Database Save Error:', dbError);
        // We don't fail the request if saving fails, we just return the plan without ID
        // Or maybe we should warn? For now, proceed.
      }
    }

    return NextResponse.json({ ...plan, projectId });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
