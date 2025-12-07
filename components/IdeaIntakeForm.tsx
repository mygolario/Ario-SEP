'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function IdeaIntakeForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    ideaOneLiner: '',
    problem: '',
    solution: '',
    audience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ideaOneLiner.trim()) newErrors.ideaOneLiner = 'توضیح ایده الزامی است.';
    if (!formData.problem.trim()) newErrors.problem = 'توضیح مشکل الزامی است.';
    if (!formData.solution.trim()) newErrors.solution = 'توضیح راه‌حل الزامی است.';
    if (!formData.audience.trim()) newErrors.audience = 'توضیح مخاطب الزامی است.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 401) {
          toast({
            variant: "destructive",
            title: "نیاز به ورود",
            description: data.message || "برای ساخت پلن باید ابتدا وارد حساب کاربری شوید.",
            action: <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>ورود</Button>
          });
          return;
      }

      if (res.status === 403 && data.code === "PLAN_LIMIT_REACHED") {
          toast({
            variant: "destructive",
            title: "محدودیت پلن رایگان",
            description: "ظرفیت پلن فعلی برای ساخت پروژه جدید پر شده است.",
            action: <Button variant="outline" size="sm" onClick={() => window.location.href = '/pricing'}>مشاهده پلن‌ها</Button>
          });
          return;
      }

      if (res.status === 403) {
          toast({
            variant: "destructive",
            title: "دسترسی غیرمجاز",
             description: data.message || "شما اجازه انجام این کار را ندارید.",
          });
          return;
      }

      if (!res.ok) throw new Error(data.message || 'Submission failed');

      setSuccess(true);
      toast({
        title: "ثبت شد!",
        description: "ایده‌تان با موفقیت ثبت شد. در حال انتقال...",
      });
      
      if (data.id) {
        // Redirect to the new project summary page
        window.location.href = `/dashboard/projects/${data.id}`;
      } else {
        // Fallback
        window.location.href = '/dashboard/projects';
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطا",
        description: error.message || "در ارسال فرم مشکلی پیش آمد. لطفاً دوباره تلاش کن.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 rounded-2xl border p-6 md:p-8 space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-300">ایده‌ات با موفقیت ثبت شد</h3>
          <p className="text-green-700 dark:text-green-400">
            در ادامه برایت یک خلاصه یک‌صفحه‌ای ساخته می‌شود.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSuccess(false)}
            className="mt-4"
          >
            ثبت ایده جدید
          </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
      <div className="space-y-2 text-center sm:text-start">
        <h3 className="text-xl font-bold text-slate-900">جزئیات ایده شما</h3>
        <p className="text-sm text-slate-500">فرم زیر را پر کنید تا تحلیل اولیه را شروع کنیم.</p>
      </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Idea One Liner */}
          <div className="space-y-2">
            <Label htmlFor="ideaOneLiner" className="block text-sm font-medium text-slate-800 mb-1">در یک جمله بگو می‌خوای چی بسازی <span className="text-red-500">*</span></Label>
            <Input 
              id="ideaOneLiner" 
              placeholder="مثال: می‌خوام یه فروشگاه آنلاین لباس بسازم."
              value={formData.ideaOneLiner}
              onChange={(e) => handleChange('ideaOneLiner', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition ${errors.ideaOneLiner ? 'border-red-500' : ''}`}
            />
             {errors.ideaOneLiner ? (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.ideaOneLiner}</p>
             ) : (
                <p className="mt-1 text-xs text-slate-500">خیلی ساده و کوتاه بنویس؛ لازم نیست رسمی باشد.</p>
             )}
          </div>

          {/* Problem */}
          <div className="space-y-2">
            <Label htmlFor="problem" className="block text-sm font-medium text-slate-800 mb-1">چه مشکل یا نیازی را می‌خوای حل کنی؟ <span className="text-red-500">*</span></Label>
            <Textarea 
              id="problem" 
              placeholder="مثال: پیدا کردن لباس خوب سخته / مشتری کم دارم / مردم آموزش درست ندارن."
              value={formData.problem}
              onChange={(e) => handleChange('problem', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition min-h-[80px] ${errors.problem ? 'border-red-500' : ''}`}
            />
            {errors.problem ? (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.problem}</p>
            ) : (
                <p className="mt-1 text-xs text-slate-500">به ساده‌ترین شکل ممکن مشکل را بنویس.</p>
            )}
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <Label htmlFor="solution" className="block text-sm font-medium text-slate-800 mb-1">راه‌حل یا ایده‌ات چطور این مشکل را حل می‌کند؟ <span className="text-red-500">*</span></Label>
             <Textarea 
              id="solution" 
              placeholder="مثال: می‌خوام یه سایت با فیلترگذاری بسازم / می‌خوام دوره آموزشی درست کنم."
              value={formData.solution}
              onChange={(e) => handleChange('solution', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition min-h-[80px] ${errors.solution ? 'border-red-500' : ''}`}
            />
            {errors.solution ? (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.solution}</p>
            ) : (
                <p className="mt-1 text-xs text-slate-500">در یک یا دو جمله خیلی ساده توضیح بده.</p>
            )}
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience" className="block text-sm font-medium text-slate-800 mb-1">این ایده برای چه کسانی است؟ <span className="text-red-500">*</span></Label>
            <Input 
              id="audience" 
              placeholder="مثال: دانشجوها / صاحب‌کافه‌ها / کسب‌وکارهای کوچک / گیمرها..."
              value={formData.audience}
              onChange={(e) => handleChange('audience', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition ${errors.audience ? 'border-red-500' : ''}`}
            />
             {errors.audience ? (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.audience}</p>
             ) : (
                <p className="mt-1 text-xs text-slate-500">کسانی که قرار است از این استفاده کنند را خیلی کوتاه بنویس.</p>
             )}
          </div>

          <Button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 text-sm md:text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors mt-4" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              'ارسال و شروع ارزیابی'
            )}
          </Button>

        </form>
    </div>
  );
}
