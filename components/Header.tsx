import Link from 'next/link';
import { Zap } from 'lucide-react';
import AuthButton from '@/components/AuthButton';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="font-bold text-xl flex items-center gap-2 text-slate-900 dark:text-slate-100">
             <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
             <span>StartupExec</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700 dark:text-slate-300 font-medium">
          <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">پلن‌ها</Link>
          <Link href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">امکانات</Link>
        </nav>

        {/* Auth Button */}
        <div suppressHydrationWarning>
            <AuthButton />
        </div>
      </div>
    </header>
  );
}
