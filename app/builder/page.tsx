import AuthButton from '@/components/AuthButton';
import IdeaGenerator from '@/components/IdeaGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col items-center space-y-4 relative">
           <div className="absolute left-0 top-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>
              </Link>
           </div>
          <div className="absolute right-0 top-0">
            <AuthButton />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Startup Builder
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-center">
            Turn your idea into a 7-day execution plan in seconds using AI.
          </p>
        </header>
        
        <IdeaGenerator />
      </div>
    </main>
  );
}
