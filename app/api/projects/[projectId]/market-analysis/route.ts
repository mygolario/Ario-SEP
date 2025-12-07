import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateMarketAnalysis } from '@/lib/ai/market-analysis';
import { NextResponse } from 'next/server';

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

    // 1. Fetch Project + Strategy Map
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
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // 2. Prepare data for AI
    // We need at least a basic description or strategy map to work with.
    // If no strategy map, fallback to project description.
    
    // Cast the JSON to the expected type safely
    const strategyMap = project.strategyMaps[0]?.summary 
        ? { summary: project.strategyMaps[0].summary } 
        : { summary: { title: project.title, coreGoal: 'N/A', elevatorPitch: 'N/A' } };

    // Ideally we type this properly, but for now we construct a lightweight object 
    // to satisfy the AI function signature if needed, or update the AI function to take primitives.
    // The lib/ai/market-analysis.ts expects a StartupPlan-like object for 'summary'.
    
    const partialPlan: any = {
        summary: strategyMap.summary
    };

    // 3. Generate Analysis
    const marketData = await generateMarketAnalysis(
        partialPlan,
        project.description,
        project.targetAudience
    );

    // 4. Save to DB
    const marketAnalysis = await prisma.marketAnalysis.upsert({
      where: {
        projectId: project.id,
      },
      update: {
        data: marketData,
        createdAt: new Date(),
      },
      create: {
        projectId: project.id,
        data: marketData,
      },
    });

    return NextResponse.json(marketAnalysis.data);

  } catch (error: any) {
    console.error('Market Analysis Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate market analysis' },
      { status: 500 }
    );
  }
}
