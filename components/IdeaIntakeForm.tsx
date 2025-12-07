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
    mainNeed: '',
    budgetAndTimeline: '',
    extraInfo: '',
    contact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.ideaOneLiner.trim()) newErrors.ideaOneLiner = 'توضیح ایده الزامی است.';
    if (!formData.mainNeed) newErrors.mainNeed = 'انتخاب نوع نیاز الزامی است.';
    if (!formData.budgetAndTimeline.trim()) newErrors.budgetAndTimeline = 'بودجه و زمان الزامی است.';
    if (!formData.contact.trim()) newErrors.contact = 'راه ارتباطی الزامی است.';
    
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

      if (!res.ok) throw new Error('Submission failed');

      setSuccess(true);
      toast({
        title: "ثبت شد!",
        description: "ایده‌تان با موفقیت ثبت شد. به‌زودی با شما تماس می‌گیریم.",
      });
      setFormData({
        ideaOneLiner: '',
        mainNeed: '',
        budgetAndTimeline: '',
        extraInfo: '',
        contact: '',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطا",
        description: "در ارسال فرم مشکل پیش آمد. لطفاً دوباره تلاش کنید.",
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
          <h3 className="text-xl font-bold text-green-800 dark:text-green-300">ایده‌تان با موفقیت ثبت شد</h3>
          <p className="text-green-700 dark:text-green-400">
            حداکثر تا چند روز کاری آینده آن را بررسی می‌کنیم و در صورت نیاز با شما تماس می‌گیریم.
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
            <Label htmlFor="ideaOneLiner" className="block text-sm font-medium text-slate-800 mb-1">ایده‌تان را در یک جمله توضیح دهید <span className="text-red-500">*</span></Label>
            <Input 
              id="ideaOneLiner" 
              placeholder="مثال: می‌خواهم پلتفرمی بسازم که مربی‌های زبان را به شاگردها وصل کند."
              value={formData.ideaOneLiner}
              onChange={(e) => handleChange('ideaOneLiner', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition ${errors.ideaOneLiner ? 'border-red-500' : ''}`}
            />
            {errors.ideaOneLiner ? (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.ideaOneLiner}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">خیلی ساده و خودمانی بنویسید؛ لازم نیست اصطلاحات تخصصی استفاده کنید.</p>
            )}
          </div>

          {/* Main Need - Radio Group */}
          <div className="space-y-2">
            <Label className="block text-sm font-medium text-slate-800 mb-1">الان مهم‌ترین کاری که از ما می‌خواهید چیست؟ <span className="text-red-500">*</span></Label>
            <RadioGroup 
              value={formData.mainNeed} 
              onValueChange={(val) => handleChange('mainNeed', val)}
              className="flex flex-col space-y-3"
            >
              {[
                { val: 'evaluate', label: 'فقط ارزیابی ایده و گفتن مسیر شروع' },
                { val: 'mvp', label: 'طراحی و اجرای نسخه اول (MVP)' },
                { val: 'improve', label: 'ارتقای وبسایت یا محصول فعلی' },
                { val: 'guide', label: 'هنوز مطمئن نیستم، فقط می‌خواهم راهنمایی بگیرم' },
              ].map((opt) => (
                <div key={opt.val} className="flex items-center gap-2 text-sm text-slate-700">
                  <RadioGroupItem value={opt.val} id={opt.val} className="text-indigo-600 focus:ring-indigo-500" />
                  <Label htmlFor={opt.val} className="font-normal cursor-pointer text-slate-700">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.mainNeed ? (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.mainNeed}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">گزینه‌ای را انتخاب کنید که بیش‌تر به وضعیت فعلی شما نزدیک است.</p>
            )}
          </div>

          {/* Budget & Timeline */}
          <div className="space-y-2">
            <Label htmlFor="budgetAndTimeline" className="block text-sm font-medium text-slate-800 mb-1">حدود بودجه و بازه زمانی مورد انتظار <span className="text-red-500">*</span></Label>
            <Input 
              id="budgetAndTimeline" 
              placeholder="مثال: بین ۲۰ تا ۵۰ میلیون، تحویل حدود ۱ تا ۲ ماه"
              value={formData.budgetAndTimeline}
              onChange={(e) => handleChange('budgetAndTimeline', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition ${errors.budgetAndTimeline ? 'border-red-500' : ''}`}
            />
            {errors.budgetAndTimeline && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.budgetAndTimeline}</p>
            )}
            {!errors.budgetAndTimeline && <p className="mt-1 text-xs text-slate-500">نیازی به عدد دقیق نیست؛ حدود بودجه و بازه زمانی که در ذهن دارید را بنویسید.</p>}
          </div>

          {/* Extra Info */}
          <div className="space-y-2">
            <Label htmlFor="extraInfo" className="block text-sm font-medium text-slate-800 mb-1">توضیحات یا لینک‌های اضافه (اختیاری)</Label>
            <Textarea 
              id="extraInfo" 
              placeholder="اگر نمونه مشابه، رقیب، پیج اینستاگرام یا توضیح خاصی دارید اینجا بنویسید..."
              value={formData.extraInfo}
              onChange={(e) => handleChange('extraInfo', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition min-h-[80px]"
            />
            <p className="mt-1 text-xs text-slate-500">می‌توانید لینک سایت‌های مشابه، رقبای اصلی یا هر توضیحی که کمک می‌کند ما بهتر ایده‌تان را بفهمیم اضافه کنید.</p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="contact" className="block text-sm font-medium text-slate-800 mb-1">راه ارتباطی ترجیحی شما <span className="text-red-500">*</span></Label>
            <Input 
              id="contact" 
              placeholder="مثال: شماره موبایل، تلگرام، ایمیل یا اینستاگرام"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition ${errors.contact ? 'border-red-500' : ''}`}
            />
            {errors.contact && (
               <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.contact}</p>
            )}
             {!errors.contact && <p className="mt-1 text-xs text-slate-500">اطلاعات تماسی که بیش‌تر چک می‌کنید را بنویسید تا در صورت نیاز با شما هماهنگ کنیم.</p>}
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
