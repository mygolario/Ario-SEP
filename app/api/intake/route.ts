import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure this matches your existing prisma export

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ideaOneLiner, mainNeed, budgetAndTimeline, extraInfo, contact } = body;

    // Basic Validation
    if (!ideaOneLiner || !mainNeed || !budgetAndTimeline || !contact) {
      return NextResponse.json(
        { error: 'لطفاً تمام فیلدهای الزامی را پر کنید.' },
        { status: 400 }
      );
    }

    // Persist to Database
    const intake = await prisma.ideaIntake.create({
      data: {
        ideaOneLiner,
        mainNeed,
        budgetAndTimeline,
        extraInfo: extraInfo || null, // Handle optional field
        contact,
      },
    });

    return NextResponse.json({ success: true, id: intake.id });
  } catch (error) {
    console.error('Intake form error:', error);
    return NextResponse.json(
      { error: 'خطایی در پردازش درخواست رخ داد.' },
      { status: 500 }
    );
  }
}
