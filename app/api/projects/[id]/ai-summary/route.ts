import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "ابتدا وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    const { id: projectId } = await params;

    const project = await prisma.ideaIntake.findUnique({
      where: { id: projectId },
    });

    if (!project || (project.userId && project.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, message: "پروژه پیدا نشد." },
        { status: 404 }
      );
    }

    const { ideaOneLiner, problem, solution, audience } = project;

    const prompt = `
تو یک مشاور استارتاپ و تحلیل‌گر بیزینس هستی. بر اساس اطلاعات زیر یک خلاصه تحلیلی کوتاه برای یک بنیان‌گذار ایرانی بنویس.
خلاصه باید شامل این بخش‌ها باشد:
- توضیح ایده و هسته اصلی آن
- مشکلی که این ایده حل می‌کند
- راه‌حل و ارزش پیشنهادی
- مخاطبان هدف
- ۲–۳ نکته مهم یا ریسک کلیدی که باید حواس‌شان به آن باشد

خلاصه را حداکثر در ۸–۱۰ جمله بنویس و کاملاً فارسی و روان باشد.

اطلاعات ایده:
- ایده در یک جمله: ${ideaOneLiner}
- مشکل: ${problem}
- راه‌حل: ${solution}
- مشتری یا مخاطب هدف: ${audience}
`;

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "کلید API برای مدل هوش مصنوعی تنظیم نشده است." },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.OPENAI_API_KEY ? "https://api.openai.com/v1/chat/completions" : "https://openrouter.ai/api/v1/chat/completions";
    const model =
      process.env.OPENAI_API_KEY ? "gpt-4o-mini" : "openai/gpt-3.5-turbo";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(baseUrl.includes("openrouter")
          ? { "HTTP-Referer": "https://your-domain.com", "X-Title": "StartupExec" }
          : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are an expert Farsi-speaking startup advisor." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
        const errText = await response.text();
      console.error("AI error", errText);
      return NextResponse.json(
        { success: false, message: "در تولید خلاصه با هوش مصنوعی مشکلی پیش آمد." },
        { status: 500 }
      );
    }

    const json = await response.json();
    const aiText =
      json.choices?.[0]?.message?.content?.trim() ?? "خلاصه در حال حاضر در دسترس نیست.";

    const updated = await prisma.ideaIntake.update({
      where: { id: project.id },
      data: { aiSummary: aiText },
    });

    return NextResponse.json({ success: true, summary: updated.aiSummary });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "خطای غیرمنتظره رخ داد." },
      { status: 500 }
    );
  }
}
