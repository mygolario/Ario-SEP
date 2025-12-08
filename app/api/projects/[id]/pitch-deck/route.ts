import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generatePitchDeck } from '@/lib/ai/pitch-deck';
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

    // 1. Fetch Project + All Context
    const project = await prisma.ideaIntake.findUnique({
      where: {
        id: projectId,
      },
      include: {
        strategyMaps: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        deepPlan: true,
        marketAnalysis: true,
        brandingKit: true,
        landingPagePlan: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId && project.userId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 2. Prepare data for AI
    const projectData = {
      title: project.ideaOneLiner,
      description: `${project.problem} - ${project.solution}`,
      targetAudience: project.audience,
    };

    // 3. Generate Deck
    const pitchDeckData = await generatePitchDeck(projectData);

    // 4. Save/Update DB
    const pitchDeck = await prisma.pitchDeck.upsert({
      where: {
        ideaIntakeId: projectId,
      },
      update: {
        data: pitchDeckData as any,
        createdAt: new Date(),
      },
      create: {
        ideaIntakeId: projectId,
        data: pitchDeckData as any,
      },
    });

    return NextResponse.json(pitchDeck.data);

  } catch (error: any) {
    console.error('Pitch Deck Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate pitch deck' },
      { status: 500 }
    );
  }
}
