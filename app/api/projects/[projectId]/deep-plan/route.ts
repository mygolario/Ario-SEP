import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateDeepPlan } from '@/lib/ai/deep-plan';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { projectId } = await params;

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: {
         id: projectId
      },
      include: {
        deepPlan: true
      }
    });

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Call AI to generate deep plan
    const deepPlanData = await generateDeepPlan(project);

    // Save to database
    const savedDeepPlan = await prisma.deepPlan.upsert({
      where: {
        projectId: projectId,
      },
      update: {
        data: deepPlanData as any, // Prisma Json handling
      },
      create: {
        projectId: projectId,
        data: deepPlanData as any,
      },
    });

    return NextResponse.json(savedDeepPlan);
  } catch (error: any) {
    console.error('Deep Plan Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate deep plan' },
      { status: 500 }
    );
  }
}
