'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Zap, Loader2, Target, RotateCw, CheckCircle2, Clock } from 'lucide-react';
import { ExecutionCoachResponse } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExecutionCoachPanelProps {
  projectId: string;
}

export default function ExecutionCoachPanel({ projectId }: ExecutionCoachPanelProps) {
  const [data, setData] = useState<ExecutionCoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/execution-coach`, {
        method: 'POST',
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate tasks');
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('خطا در دریافت پیشنهادات. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-linear-to-r from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
          <Zap className="h-4 w-4" />
          مربی اجرا
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="left">
        <SheetHeader className="mb-6 text-right">
          <SheetTitle className="flex items-center gap-2 text-xl justify-end">
             مربی اجرا
             <Zap className="h-5 w-5 text-indigo-500" />
          </SheetTitle>
          <SheetDescription className="text-right">
            راهنمای هوشمند شما برای قدم‌های بعدی.
          </SheetDescription>
        </SheetHeader>

        {!data && !loading && (
           <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
               <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full">
                   <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
               </div>
               <p className="text-sm text-muted-foreground max-w-xs">
                   لیستی شخصی‌سازی شده از کارهای مهم و تاثیرگذار متناسب با مرحله فعلی پروژه‌تان دریافت کنید.
               </p>
               <Button onClick={fetchTasks} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                   دریافت اقدامات بعدی
               </Button>
           </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm text-muted-foreground animate-pulse">در حال تحلیل استراتژی پروژه...</p>
            </div>
        )}

        {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
                {error}
                <Button variant="link" onClick={fetchTasks} className="mt-2 text-red-700 dark:text-red-300 underline">
                    تلاش مجدد
                </Button>
            </div>
        )}

        {data && !loading && (
            <div className="space-y-6 pb-8 text-right" dir="rtl">
                <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1 text-sm">خلاصه تمرکز</h4>
                    <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
                        {data.focusSummary}
                    </p>
                </div>

                <div className="flex items-center justify-between flex-row-reverse">
                    <h4 className="font-semibold text-sm">برنامه عملیاتی</h4>
                    <Button variant="ghost" size="sm" onClick={fetchTasks} className="h-8 text-xs text-muted-foreground flex-row-reverse">
                        <RotateCw className="h-3 w-3 ml-1" />
                        بروزرسانی
                    </Button>
                </div>

                <div className="space-y-4">
                    {data.tasks.map((task, i) => (
                        <Card key={i} className="relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                            <div className={`absolute right-0 top-0 bottom-0 w-1 ${
                                task.priority === 'high' ? 'bg-red-500' : 
                                task.priority === 'medium' ? 'bg-yellow-500' : 
                                'bg-blue-500'
                            }`} />
                            <CardHeader className="p-4 pb-2 pr-5">
                                <div className="flex justify-between items-start gap-2 flex-row-reverse">
                                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold">
                                        {task.category.replace('_', ' ')}
                                    </Badge>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 ml-1" />
                                        {task.estimatedTimeMinutes} دقیقه
                                    </div>
                                </div>
                                <CardTitle className="text-base font-bold mt-2 leading-tight">
                                    {task.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-1 pr-5">
                                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                    {task.description}
                                </p>
                                {task.suggestedTools.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {task.suggestedTools.map(tool => (
                                            <span key={tool} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )}

      </SheetContent>
    </Sheet>
  );
}
