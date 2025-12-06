import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { generateBrandingKit } from '@/lib/ai/branding';

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

    // Call AI to generate branding kit
    const brandingData = await generateBrandingKit(project);

    // Save to database
    const savedBrandingKit = await prisma.brandingKit.upsert({
      where: {
        projectId: projectId,
      },
      update: {
        data: brandingData as any,
      },
      create: {
        projectId: projectId,
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
