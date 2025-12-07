import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { FeedbackType } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { type, message, projectId, metadata } = body;

    // Validate type
    if (!Object.values(FeedbackType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.length < 5) {
      return NextResponse.json(
        { error: 'Message must be at least 5 characters long' },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: user?.id,
        projectId: projectId || null,
        type: type,
        message: message.substring(0, 2000), // Change limit as needed
        metadata: metadata || {},
      },
    });

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error('Feedback Submission Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
