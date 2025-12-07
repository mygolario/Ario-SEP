import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "ایمیل و رمز عبور الزامی است." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "ایمیل یا رمز عبور اشتباه است." },
        { status: 401 }
      );
    }

    // Check for Admin Upgrade (if not already admin)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email === adminEmail && user.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "ADMIN",
          subscriptionTier: "PRO",
        },
      });
    }

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
