import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateMarketAnalysis } from '@/lib/ai/market-analysis';
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

    // 3. Generate Analysis - changed to pass full project object
    const marketData = await generateMarketAnalysis(project);

    // 4. Save to DB
    const marketAnalysis = await prisma.marketAnalysis.upsert({
      where: {
        ideaIntakeId: projectId,
      },
      update: {
        data: marketData,
        createdAt: new Date(),
      },
      create: {
        ideaIntakeId: projectId,
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
