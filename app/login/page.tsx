'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'ورود ناموفق بود');
      }

      router.push('/dashboard');
      router.refresh(); // Refresh to update server components
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-4">
             <Zap className="h-6 w-6" />
           </div>
           <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
             ورود به حساب کاربری
           </h2>
           <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
             برای دسترسی به پروژه‌ها وارد شوید.
           </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email" className="sr-only">ایمیل</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="آدرس ایمیل"
                className="relative block w-full rounded-t-xl rounded-b-none border-0 py-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">رمز عبور</Label>
              <Input
                id="password"
                name="password"
                type="password" // Keep browser default
                autoComplete="current-password"
                required
                placeholder="رمز عبور"
                className="relative block w-full rounded-b-xl rounded-t-none border-0 py-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-900">
               <AlertCircle className="h-4 w-4" />
               {error}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              ) : (
                'ورود'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
