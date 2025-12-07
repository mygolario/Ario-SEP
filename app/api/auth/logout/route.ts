import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (sessionId) {
    try {
      await prisma.session.delete({
        where: { id: sessionId },
      }).catch(() => {});
    } catch(e) {}
  }

  cookieStore.delete('session_id');

  return NextResponse.json({ success: true });
}
