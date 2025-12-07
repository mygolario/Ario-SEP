import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { cache } from 'react';

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return null;

  if (new Date() > session.expiresAt) {
    try {
      await prisma.session.delete({ where: { id: sessionId } });
    } catch {}
    return null;
  }

  return session;
});
