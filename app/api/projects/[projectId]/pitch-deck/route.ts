import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generatePitchDeck } from '@/lib/ai/pitch-deck';
import { NextResponse } from 'next/server';
import { StartupPlan, DeepPlanData, MarketAnalysisData, BrandingKitData, LandingPagePlanData } from '@/lib/types';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await params;

    // 1. Fetch Project + All Context
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id,
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

    // 2. Prepare data for AI
    const projectData = {
      title: project.title,
      description: project.description,
      targetAudience: project.targetAudience,
      plan: project.strategyMaps[0]?.data ? (project.strategyMaps[0].data as unknown as StartupPlan) : null,
      deepPlan: project.deepPlan?.data ? (project.deepPlan.data as unknown as DeepPlanData) : null,
      marketAnalysis: project.marketAnalysis?.data ? (project.marketAnalysis.data as unknown as MarketAnalysisData) : null,
      brandingKit: project.brandingKit?.data ? (project.brandingKit.data as unknown as BrandingKitData) : null,
      landingPage: project.landingPagePlan?.data ? (project.landingPagePlan.data as unknown as LandingPagePlanData) : null,
    };

    // 3. Generate Deck
    const pitchDeckData = await generatePitchDeck(projectData);

    // 4. Save/Update DB
    const pitchDeck = await prisma.pitchDeck.upsert({
      where: {
        projectId: project.id,
      },
      update: {
        data: pitchDeckData,
        createdAt: new Date(),
      },
      create: {
        projectId: project.id,
        data: pitchDeckData,
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
