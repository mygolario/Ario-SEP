import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import AuthTabs from '@/components/auth/AuthTabs';

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  const { callback: callbackParam } = await searchParams;

  const callback =
    typeof callbackParam === 'string'
      ? callbackParam
      : '/dashboard';

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
        <AuthTabs callback={callback} />
      </div>
    </main>
  );
}
