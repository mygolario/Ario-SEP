'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BrandingKitGeneratorProps {
  projectId: string;
}

export default function BrandingKitGenerator({ projectId }: BrandingKitGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/branding-kit`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate branding kit');
      }

      router.refresh();
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
        <div className="w-full max-w-xl space-y-8 animate-pulse">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                <h3 className="text-lg font-semibold text-pink-500">در حال ساخت هویت بصری...</h3>
                <p className="text-sm text-muted-foreground">انتخاب رنگ‌ها، تایپوگرافی و صدای برند.</p>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="space-y-2 max-w-sm mx-auto">
                    <div className="h-6 w-3/4 mx-auto bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded"></div>
                    <div className="h-4 w-2/3 mx-auto bg-slate-100 dark:bg-slate-900 rounded"></div>
                </div>
            </div>
        </div>
      ) : (
        <>
            <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-full mb-6 relative">
                <Palette className="h-10 w-10 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">کیت برندسازی هوشمند</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
                هویت بصری کامل و استراتژی پیام‌رسانی استارتاپ خود را فوراً ایجاد کنید.
                شامل پالت‌های رنگی، تایپوگرافی، لحن صدا و موارد دیگر.
            </p>
            
            <Button 
                size="lg" 
                onClick={handleGenerate} 
                disabled={loading}
                className="bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/20"
            >
                <Palette className="ml-2 h-5 w-5" />
                تولید کیت برند
            </Button>
        </>
      )}
    </div>
  );
}
