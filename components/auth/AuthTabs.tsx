'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, AlertCircle } from 'lucide-react';

export default function AuthTabs({ callback = '/dashboard' }: { callback?: string }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: mode === 'register' ? form.name : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'عملیات ناموفق بود.');
      }

      router.push(callback);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-4">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
           {mode === 'login' ? 'ورود به حساب کاربری' : 'ساخت حساب کاربری جدید'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
           {mode === 'login' 
             ? 'برای دسترسی به پروژه‌ها وارد شوید.' 
             : 'برای شروع ساختن ایده خود، ثبت‌نام کنید.'}
        </p>
      </div>

       {/* Mode Toggles using simpler buttons to avoid Shadcn Tabs dependency if not installed/configured properly, or just for custom styling */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'login' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          ورود
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'register' 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          ثبت‌نام
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
           {mode === 'register' && (
              <div>
                <Label htmlFor="name" className="sr-only">نام (اختیاری)</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="نام شما (اختیاری)"
                  className="relative block w-full rounded-t-xl rounded-b-none border-0 py-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:rounded-b-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
           )}

          <div>
            <Label htmlFor="email" className="sr-only">ایمیل</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="آدرس ایمیل"
              className={`relative block w-full border-0 py-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  mode === 'register' ? 'rounded-none' : 'rounded-t-xl rounded-b-none'
              }`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="password" className="sr-only">رمز عبور</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'login' ? "current-password" : "new-password"}
              required
              placeholder={mode === 'register' ? "رمز عبور (حداقل ۶ کاراکتر)" : "رمز عبور"}
              className="relative block w-full rounded-b-xl rounded-t-none border-0 py-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            className="group relative flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 h-auto"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
               mode === 'login' ? 'ورود' : 'ثبت‌نام'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
