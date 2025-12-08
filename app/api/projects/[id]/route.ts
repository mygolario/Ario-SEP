import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: projectId } = await params;

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { 
        title, 
        description, 
        targetAudience, 
        budgetLevel, 
        experienceLevel, 
        timePerWeekHours 
    } = json;

    // Validate ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Basic validation
    if (title && title.trim().length === 0) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        targetAudience,
        budgetLevel,
        experienceLevel,
        timePerWeekHours: timePerWeekHours ? parseInt(timePerWeekHours) : undefined,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Project Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: projectId } = await params;

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate ownership
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });
  
    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
  
    if (project.userId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete related records (transaction explicitly if needed, but strict mode might require careful ordering if no CASCADE on DB)
    // Prisma schema usually handles relation cleanup if configured, but safe manual delete is good for explicitly structured apps.
    // However, with standard Prisma relations, deleting the parent (Project) should cascade if defined in schema (onDelete: Cascade).
    // Let's check schema.
    
    // The schema views:
    // user User? @relation(fields: [userId], references: [id])
    // strategyMaps StrategyMap[]
    // deepPlan DeepPlan?
    
    // The relations in StrategyMap and DeepPlan do NOT usually have `onDelete: Cascade` by default in Prisma unless specified.
    // So we should delete children first to be safe, or use a transaction.

    await prisma.$transaction([
        prisma.strategyMap.deleteMany({ where: { ideaIntakeId: projectId } }),
        prisma.deepPlan.deleteMany({ where: { ideaIntakeId: projectId } }),
        prisma.project.delete({ where: { id: projectId } })
    ]);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Project Delete Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
