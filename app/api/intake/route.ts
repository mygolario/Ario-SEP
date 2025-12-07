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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    
    if (!dbUser) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد." },
        { status: 401 }
      );
    }
    
    // Check limit based on subscription tier
    const existingCount = await prisma.ideaIntake.count({
      where: { userId: user.id },
    });

    let maxProjects = 1; // default FREE

    if (dbUser.subscriptionTier === "STARTER") {
      maxProjects = 5;
    } else if (dbUser.subscriptionTier === "PRO") {
      maxProjects = 50; 
    }

    // ADMIN: Unlimited
    if (dbUser.role === "ADMIN") {
      maxProjects = 9999;
    }

    if (existingCount >= maxProjects) {
      return NextResponse.json(
        {
          success: false,
          code: "PLAN_LIMIT_REACHED",
          message:
            "ظرفیت این پلن برای تعداد پروژه‌ها پر شده است. برای ساخت پروژه‌ی جدید باید پلن بالاتر را فعال کنید.",
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
