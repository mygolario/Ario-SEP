import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: "UNAUTHENTICATED",
          message: "برای ساخت پلن، ابتدا باید وارد حساب کاربری شوید.",
        },
        { status: 401 }
      );
    }
    
    // Check free tier limit (1 project per user)
    const count = await prisma.ideaIntake.count({
      where: { userId: user.id },
    });

    if (count >= 1) {
      return NextResponse.json(
        {
          success: false,
          code: "FREE_LIMIT_REACHED",
          message:
            "شما یک پلن رایگان ساخته‌اید. برای ساخت پروژه‌ی جدید باید اشتراک فعال داشته باشید.",
        },
        { status: 403 }
      );
    }

    const { ideaOneLiner, problem, solution, audience } = await req.json();

    if (
      !ideaOneLiner ||
      !problem ||
      !solution ||
      !audience ||
      typeof ideaOneLiner !== "string" ||
      typeof problem !== "string" ||
      typeof solution !== "string" ||
      typeof audience !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "لطفاً همه فیلدها را به صورت کامل پر کنید." },
        { status: 400 }
      );
    }

    const intake = await prisma.ideaIntake.create({
      data: {
        ideaOneLiner,
        problem,
        solution,
        audience,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, id: intake.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
