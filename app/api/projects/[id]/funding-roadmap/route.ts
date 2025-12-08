import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateFundingRoadmap } from '@/lib/ai/funding-roadmap';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const project = await prisma.ideaIntake.findUnique({
      where: {
        id: projectId,
      },
      include: {
        strategyMaps: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId && project.userId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const fundingRoadmapData = await generateFundingRoadmap({
      title: project.ideaOneLiner,
      description: `${project.problem} - ${project.solution}`,
      targetAudience: project.audience,
    });

    // 4. Save/Update DB
    const fundingRoadmap = await prisma.fundingRoadmap.upsert({
      where: {
        ideaIntakeId: projectId,
      },
      update: {
        data: fundingRoadmapData as any,
        createdAt: new Date(),
      },
      create: {
        ideaIntakeId: projectId,
        data: fundingRoadmapData as any,
      },
    });

    return NextResponse.json(fundingRoadmap.data);

  } catch (error: any) {
    console.error('Funding Roadmap Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate funding roadmap' },
      { status: 500 }
    );
  }
}
