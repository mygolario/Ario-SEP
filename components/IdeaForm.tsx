'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { IdeaInput } from '@/lib/types';

interface IdeaFormProps {
  onSubmit: (data: IdeaInput) => void;
  isLoading: boolean;
}

export default function IdeaForm({ onSubmit, isLoading }: IdeaFormProps) {
  const [formData, setFormData] = useState<IdeaInput>({
    ideaTitle: '',
    ideaDescription: '',
    targetAudience: '',
    budgetLevel: 'low',
    experienceLevel: 'beginner',
    timePerWeek: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof IdeaInput, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle>ایده استارتاپی خود را توصیف کنید</CardTitle>
        <CardDescription>
          جزئیات زیر را پر کنید تا استراتژی اجرایی اختصاصی شما ساخته شود.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ideaTitle">عنوان ایده / نام</Label>
            <Input
              id="ideaTitle"
              name="ideaTitle"
              placeholder="مثال: اوبر برای گردشگری"
              required
              value={formData.ideaTitle}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ideaDescription">توضیحات</Label>
            <Textarea
              id="ideaDescription"
              name="ideaDescription"
              placeholder="چه مشکلی را حل می‌کند و چگونه؟"
              required
              className="min-h-[100px]"
              value={formData.ideaDescription}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">مخاطب هدف</Label>
            <Input
              id="targetAudience"
              name="targetAudience"
              placeholder="مشتریان شما چه کسانی هستند؟"
              required
              value={formData.targetAudience}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetLevel">سطح بودجه</Label>
              <Select
                name="budgetLevel"
                value={formData.budgetLevel}
                onValueChange={(val) => handleSelectChange('budgetLevel', val)}
              >
                <SelectTrigger id="budgetLevel" className="flex-row-reverse text-right">
                  <SelectValue placeholder="انتخاب بودجه" />
                </SelectTrigger>
                <SelectContent align="end" dir="rtl">
                  <SelectItem value="low">کم (سرمایه شخصی)</SelectItem>
                  <SelectItem value="medium">متوسط (کمی پس‌انداز)</SelectItem>
                  <SelectItem value="high">زیاد (سرمایه‌گذار)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">سطح تجربه</Label>
              <Select
                name="experienceLevel"
                value={formData.experienceLevel}
                onValueChange={(val) => handleSelectChange('experienceLevel', val)}
              >
                <SelectTrigger id="experienceLevel" className="flex-row-reverse text-right">
                  <SelectValue placeholder="انتخاب تجربه" />
                </SelectTrigger>
                <SelectContent align="end" dir="rtl">
                  <SelectItem value="beginner">مبتدی</SelectItem>
                  <SelectItem value="intermediate">متوسط</SelectItem>
                  <SelectItem value="advanced">پیشرفته</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timePerWeek">زمان در هفته (ساعت)</Label>
            <Input
              id="timePerWeek"
              name="timePerWeek"
              type="number"
              placeholder="مثال: ۲۰"
              value={formData.timePerWeek || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  timePerWeek: e.target.value ? parseInt(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'در حال ساخت پلن...' : 'تولید نقشه استراتژی'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
