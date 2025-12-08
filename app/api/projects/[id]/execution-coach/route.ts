import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateExecutionPlan } from '@/lib/ai/execution-coach';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: projectId } = await params;

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch project with all related plans to give full context to AI
    const project = await prisma.ideaIntake.findUnique({
      where: {
         id: projectId
      },
      include: {
        strategyMaps: {
            orderBy: { createdAt: 'desc' },
            take: 1
        },
        deepPlan: true,
        brandingKit: true,
        landingPagePlan: true,
      }
    });

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId && project.userId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const tasks = await generateExecutionPlan(project);

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Execution Coach Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate execution tasks' },
      { status: 500 }
    );
  }
}
