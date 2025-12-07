import AuthButton from '@/components/AuthButton';
import IdeaIntakeForm from '@/components/IdeaIntakeForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col items-center space-y-4 relative">
           <div className="absolute left-0 top-0 hidden md:block">
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    بازگشت به خانه
                </Link>
              </Button>
           </div>
          <div className="absolute right-0 top-0">
            <AuthButton />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            استارتاپ‌ساز
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-center">
            با کمک هوش مصنوعی، ایده خود را در چند ثانیه به یک برنامه اجرایی ۷ روزه تبدیل کنید.
          </p>
        </header>
        
        <IdeaIntakeForm />
      </div>
    </main>
  );
}
