import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "ایمیل و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "رمز عبور باید حداقل ۶ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "این ایمیل قبلاً ثبت شده است." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const isAdminEmail = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: typeof name === "string" && name.trim() ? name.trim() : null,
        role: isAdminEmail ? "ADMIN" : "USER",
        subscriptionTier: isAdminEmail ? "PRO" : undefined,
      },
    });

    // auto login after signup
    await createSession(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
