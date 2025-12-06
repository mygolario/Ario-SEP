import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import StrategyPdf from '@/components/pdf/StrategyPdf';
import { StartupPlan } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        strategyMaps: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    if (!project.strategyMaps?.[0]?.data) {
      return new NextResponse('No strategy map data found', { status: 404 });
    }

    const plan = project.strategyMaps[0].data as unknown as StartupPlan;

    // Generate PDF stream
    const stream = await renderToStream(React.createElement(StrategyPdf, { plan, title: project.title }));
    
    // Convert Node stream to Buffer to avoid Web Stream compatibility issues in Next.js App Router
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk as Uint8Array);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_strategy.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
