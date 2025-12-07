import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardRoot() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  redirect('/dashboard/projects');
}
