'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  const [type, setType] = useState<'BUG' | 'IDEA' | 'CONFUSION' | 'OTHER'>('BUG');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Try to extract projectId from URL if present (e.g. /project/[id])
    const pathParts = pathname?.split('/') || [];
    const projectIndex = pathParts.indexOf('project');
    const projectId = projectIndex !== -1 && projectIndex + 1 < pathParts.length ? pathParts[projectIndex + 1] : undefined;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message,
          projectId,
          metadata: {
            pathname,
            userAgent: navigator.userAgent,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setMessage('');
        setType('BUG');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="fixed bottom-4 end-4 z-50 shadow-lg rounded-full px-4 h-10 gap-2 border bg-background/80 backdrop-blur hover:bg-background"
        >
          <MessageSquare className="h-4 w-4" />
          بازخورد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in" />
            <h3 className="text-lg font-semibold">سپاسگزاریم!</h3>
            <p className="text-center text-muted-foreground">
              بازخورد شما به ما کمک می‌کند تا پلتفرم را بهتر کنیم.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="text-right space-y-3">
              <DialogTitle>ارسال بازخورد</DialogTitle>
              <DialogDescription>
                ایده‌ای دارید یا با مشکلی روبرو شدید؟ برای ما بنویسید.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-right">نوع</Label>
                <div dir="rtl">
                  <Select
                    value={type}
                    onValueChange={(val) => setType(val as any)}
                  >
                    <SelectTrigger className="text-right flex-row-reverse">
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent align="end" dir="rtl">
                      <SelectItem value="BUG">گزارش خطا (باگ)</SelectItem>
                      <SelectItem value="IDEA">پیشنهاد ویژگی جدید</SelectItem>
                      <SelectItem value="CONFUSION">رابط کاربری گیج‌کننده</SelectItem>
                      <SelectItem value="OTHER">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message" className="text-right">پیام شما</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="توضیح دهید چه اتفاقی افتاده..."
                  className="min-h-[100px] text-right"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                ارسال
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
