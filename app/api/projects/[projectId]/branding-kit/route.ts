import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateBrandingKit } from '@/lib/ai/branding';

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

    const project = await prisma.ideaIntake.findUnique({
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

    if (project.userId && project.userId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Call AI to generate branding kit
    const brandingData = await generateBrandingKit(project);

    // Save to database
    const savedBrandingKit = await prisma.brandingKit.upsert({
      where: {
        ideaIntakeId: projectId,
      },
      update: {
        data: brandingData as any,
      },
      create: {
        ideaIntakeId: projectId,
        data: brandingData as any,
      },
    });

    return NextResponse.json(savedBrandingKit);
  } catch (error: any) {
    console.error('Branding Kit Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate branding kit' },
      { status: 500 }
    );
  }
}
