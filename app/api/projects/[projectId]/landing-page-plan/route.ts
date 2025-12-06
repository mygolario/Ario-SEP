import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateLandingPagePlan } from '@/lib/ai/landing-page';

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

    // Fetch project with branding kit for context
    const project = await prisma.project.findUnique({
      where: {
         id: projectId
      },
      include: {
        brandingKit: true
      }
    });

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Call AI to generate landing page plan
    const brandingData = project.brandingKit?.data;
    const landingPagePlanData = await generateLandingPagePlan(project, brandingData);

    // Save to database
    const savedPlan = await prisma.landingPagePlan.upsert({
      where: {
        projectId: projectId,
      },
      update: {
        data: landingPagePlanData as any,
      },
      create: {
        projectId: projectId,
        data: landingPagePlanData as any,
      },
    });

    return NextResponse.json(savedPlan);
  } catch (error: any) {
    console.error('Landing Page Plan Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate landing page plan' },
      { status: 500 }
    );
  }
}
