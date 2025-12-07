'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Layout } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LandingPageGeneratorProps {
  projectId: string;
}

export default function LandingPageGenerator({ projectId }: LandingPageGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/landing-page-plan`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate landing page plan');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-card text-card-foreground min-h-[400px]">
      {loading ? (
        <div className="w-full max-w-xl space-y-6 animate-pulse">
            <div className="flex flex-col items-center space-y-4 mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <h3 className="text-lg font-semibold text-emerald-500">Constructing Wireframe...</h3>
                <p className="text-sm text-muted-foreground">Drafting headers, features, and call-to-actions.</p>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4">
                 <div className="h-24 w-full bg-slate-100 dark:bg-slate-900 rounded mb-4"></div>
                 <div className="flex gap-4">
                    <div className="h-32 w-1/3 bg-slate-100 dark:bg-slate-900 rounded"></div>
                    <div className="h-32 w-1/3 bg-slate-100 dark:bg-slate-900 rounded"></div>
                    <div className="h-32 w-1/3 bg-slate-100 dark:bg-slate-900 rounded"></div>
                 </div>
                 <div className="h-16 w-full bg-slate-100 dark:bg-slate-900 rounded"></div>
            </div>
        </div>
      ) : (
        <>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-6 relative">
                <Layout className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Landing Page Strategist</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
                Generate a high-conversion landing page structure. Includes persuasive copy, section breakdown, and SEO recommendations tailored to your audience.
            </p>
            
            <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={loading}
                className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20"
            >
                <Layout className="mr-2 h-5 w-5" />
                Generate Landing Page Plan
            </Button>
        </>
      )}
    </div>
  );
}
