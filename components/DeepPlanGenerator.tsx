'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeepPlanGeneratorProps {
  projectId: string;
}

export default function DeepPlanGenerator({ projectId }: DeepPlanGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/deep-plan`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate deep plan');
      }

      router.refresh(); // Refresh to show the new plan
    } catch (error) {
      console.error(error);
      alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-card text-card-foreground min-h-[400px]" dir="rtl">
      {loading ? (
        <div className="w-full max-w-2xl space-y-6 animate-pulse">
           <div className="flex flex-col items-center space-y-4 mb-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h3 className="text-lg font-semibold text-primary">در حال ساخت استراتژی عمیق...</h3>
              <p className="text-sm text-muted-foreground">تحلیل بازار، رقبا و مدل‌های درآمدی.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="space-y-2">
                 <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="col-span-2 space-y-2">
                 <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                 <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800"></div>
              </div>
           </div>
        </div>
      ) : (
        <>
            <div className="bg-primary/10 p-4 rounded-full mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">حالت استراتژی عمیق (بتا)</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
                دسترسی به یک تحلیل جامع چندصفحه‌ای برای استارتاپ شما.
                هوش مصنوعی ایده شما را تحلیل می‌کند تا پرسونـا، مدل درآمدی، نقشه راه دقیق و ارزیابی ریسک را تولید کند.
            </p>
            
            <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={loading}
                className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            >
                <Sparkles className="ml-2 h-5 w-5" />
                تولید برنامه عمیق
            </Button>
        </>
      )}
    </div>
  );
}
