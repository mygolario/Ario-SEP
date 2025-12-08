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
import { Zap, Loader2, Target, RotateCw, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { ExecutionCoachResponse, ExecutionTask } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ExecutionCoachPanelProps {
  projectId: string;
}

export default function ExecutionCoachPanel({ projectId }: ExecutionCoachPanelProps) {
  const [data, setData] = useState<ExecutionCoachResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/execution-coach`, {
        method: 'POST',
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate tasks');
      }

      const json = await res.json();
      setData(json);
      toast({
        title: "برنامه بروز شد",
        description: "تسک‌های جدید بر اساس وضعیت فعلی پروژه اضافه شدند.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "خطا",
        description: "مشکلی در دریافت برنامه پیش آمد.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      validation: 'اعتبارسنجی',
      marketing: 'بازاریابی',
      product: 'محصول',
      branding: 'برندینگ',
      landing_page: 'لندینگ',
      research: 'تحقیقات',
      setup: 'راه‌اندازی',
      other: 'سایر'
    };
    return map[cat] || cat;
  };

  return (
    <div className="w-full">
        {!data && !loading ? (
             <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50 w-full max-w-2xl mx-auto mt-8">
                <div className="bg-indigo-50 p-4 rounded-full">
                    <Zap className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">کوچ هوشمند اجرایی</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        بر اساس استراتژی و وضعیت فعلی پروژه، لیست کارهای دقیق و عملیاتی برای ۳ روز آینده دریافت کنید.
                    </p>
                </div>
                <Button onClick={fetchTasks} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all h-12 px-8 rounded-xl">
                    دریافت برنامه عملیاتی
                </Button>
            </div>
        ) : (
             <div className="space-y-6 w-full max-w-4xl mx-auto" dir="rtl">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                         <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <ListTodo className="h-6 w-6 text-indigo-600" />
                            برنامه اجرایی هوشمند
                        </h2>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchTasks} 
                        disabled={loading}
                        className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                        بروزرسانی برنامه
                    </Button>
                </div>

                {/* Focus Summary */}
                {data?.focusSummary && (
                    <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
                        <div className="flex items-start gap-3">
                             <div className="bg-indigo-100 p-2 rounded-lg shrink-0">
                                <Target className="h-5 w-5 text-indigo-700" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-indigo-900 text-sm">تمرکز اصلی فعلی</h3>
                                <p className="text-indigo-800 text-sm leading-relaxed">{data.focusSummary}</p>
                            </div>
                        </div>
                    </div>
                )}

                 {/* Tasks Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        // Loading placeholders
                        Array.from({ length: 4 }).map((_, i) => (
                             <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl"></div>
                        ))
                    ) : (
                        data?.tasks.map((task, i) => (
                            <Card key={i} className="group hover:border-indigo-300 hover:shadow-md transition-all duration-300 relative overflow-hidden border-slate-200">
                                <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${getPriorityColor(task.priority)}`} />
                                
                                <CardHeader className="p-4 pb-2 pr-6">
                                    <div className="flex justify-between items-start gap-2">
                                        <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 hover:bg-slate-200">
                                            {getCategoryLabel(task.category)}
                                        </Badge>
                                        <div className="flex items-center text-[11px] text-slate-400">
                                            <Clock className="h-3 w-3 ml-1" />
                                            {task.estimatedTimeMinutes} دقیقه
                                        </div>
                                    </div>
                                    <CardTitle className="text-sm md:text-base font-bold text-slate-800 mt-2 leading-relaxed">
                                        {task.title}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="p-4 pt-1 pr-6 space-y-3">
                                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed line-clamp-3">
                                        {task.description}
                                    </p>
                                    
                                    {task.suggestedTools.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-50">
                                            {task.suggestedTools.map(tool => (
                                                <span key={tool} className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                            <CheckCircle2 className="h-3.5 w-3.5 ml-1" />
                                            انجام شد
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                 </div>
             </div>
        )}
    </div>
  );
}
