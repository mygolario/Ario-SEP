import { NextResponse } from 'next/server';

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

    // TODO: Integrate with Database (Prisma) or Email Service (e.g. Brevo/Resend)
    console.log('--- New Intake Form Submission ---');
    console.log('Idea:', ideaOneLiner);
    console.log('Need:', mainNeed);
    console.log('Budget/Time:', budgetAndTimeline);
    console.log('Contact:', contact);
    console.log('Extra:', extraInfo);
    console.log('----------------------------------');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Intake form error:', error);
    return NextResponse.json(
      { error: 'خطایی در پردازش درخواست رخ داد.' },
      { status: 500 }
    );
  }
}
