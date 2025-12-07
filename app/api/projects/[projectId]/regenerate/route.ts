import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateStrategyMap } from '@/lib/ai/generate';
import { BudgetLevel, ExperienceLevel, Prisma } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { projectId } = await params;

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch project to verify ownership and get inputs
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    if (project.userId !== user.id) {
       return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    try {
        const plan = await generateStrategyMap({
            ideaTitle: project.title,
            ideaDescription: project.description,
            targetAudience: project.targetAudience,
            budgetLevel: project.budgetLevel.toLowerCase() as any, // casting back to lowercase for helper type
            experienceLevel: project.experienceLevel.toLowerCase() as any,
            timePerWeek: project.timePerWeekHours ?? undefined
        });

        // Create a new StrategyMap linked to the project
        const newMap = await prisma.strategyMap.create({
            data: {
                projectId: project.id,
                summary: plan.summary as unknown as Prisma.InputJsonValue,
                data: plan as unknown as Prisma.InputJsonValue,
            }
        });

        return NextResponse.json(newMap);

    } catch (e: any) {
        console.error("Regeneration error:", e);
        return NextResponse.json(
            { error: e.message || "Failed to regenerate plan" },
            { status: 500 }
        );
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
