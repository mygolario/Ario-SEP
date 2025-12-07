import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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
