import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateExecutionTasks } from '@/lib/ai/execution-coach';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    const { projectId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch project with all related plans to give full context to AI
    const project = await prisma.project.findUnique({
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

    if (project.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const tasks = await generateExecutionTasks(
        project,
        project.strategyMaps[0],
        project.deepPlan,
        project.brandingKit,
        project.landingPagePlan
    );

    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('Execution Coach Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate execution tasks' },
      { status: 500 }
    );
  }
}
