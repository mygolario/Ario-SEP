import { NextResponse } from 'next/server';
import { IdeaInput, StartupPlan } from '@/lib/types';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { BudgetLevel, ExperienceLevel, Prisma } from '@prisma/client';
import { generateStrategyMap } from '@/lib/ai/generate';

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

    let plan: StartupPlan;
    try {
      plan = await generateStrategyMap({
        ideaTitle,
        ideaDescription,
        targetAudience,
        budgetLevel,
        experienceLevel,
        timePerWeek,
      });
    } catch (e: any) {
      return NextResponse.json(
        { error: e.message || 'Failed to generate plan' },
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
            budgetLevel: budgetLevel.toUpperCase() as BudgetLevel,
            experienceLevel: experienceLevel.toUpperCase() as ExperienceLevel,
            timePerWeekHours: timePerWeek,
            strategyMaps: {
              create: {
                summary: plan.summary as unknown as Prisma.InputJsonValue,
                data: plan as unknown as Prisma.InputJsonValue,
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
