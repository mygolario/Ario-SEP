'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Project } from '@prisma/client';

interface ProjectSettingsProps {
  project: Project;
}

export default function ProjectSettings({ project }: ProjectSettingsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    targetAudience: project.targetAudience || '',
    budgetLevel: project.budgetLevel,
    experienceLevel: project.experienceLevel,
    timePerWeekHours: project.timePerWeekHours?.toString() || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update project');
      }

      router.refresh();
      // Ideally show toast here
      alert('پروژه با موفقیت بروزرسانی شد');
    } catch (error) {
      console.error(error);
      alert('خطا در بروزرسانی پروژه');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
        const res = await fetch(`/api/projects/${project.id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error('Failed to delete project');
        }

        router.push('/dashboard');
        router.refresh(); // Ensure dashboard list is fresh
    } catch (error) {
        console.error(error);
        alert('خطا در حذف پروژه');
        setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>جزئیات پروژه</CardTitle>
          <CardDescription>اطلاعات پروژه خود را ویرایش کنید.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea 
              id="description" 
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">مخاطب هدف</Label>
            <Input 
              id="targetAudience" 
              value={formData.targetAudience} 
              onChange={(e) => handleChange('targetAudience', e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>سطح بودجه</Label>
                <Select 
                  value={formData.budgetLevel} 
                  onValueChange={(val) => handleChange('budgetLevel', val)}
                >
                  <SelectTrigger className="flex-row-reverse text-right">
                    <SelectValue placeholder="انتخاب بودجه" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="LOW">کم</SelectItem>
                    <SelectItem value="MEDIUM">متوسط</SelectItem>
                    <SelectItem value="HIGH">زیاد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>سطح تجربه</Label>
                <Select 
                  value={formData.experienceLevel} 
                  onValueChange={(val) => handleChange('experienceLevel', val)}
                >
                  <SelectTrigger className="flex-row-reverse text-right">
                    <SelectValue placeholder="انتخاب تجربه" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="BEGINNER">مبتدی</SelectItem>
                    <SelectItem value="INTERMEDIATE">متوسط</SelectItem>
                    <SelectItem value="ADVANCED">پیشرفته</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timePerWeek">زمان در هفته (ساعت)</Label>
            <Input 
              id="timePerWeek" 
              type="number"
              value={formData.timePerWeekHours} 
              onChange={(e) => handleChange('timePerWeekHours', e.target.value)} 
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              ذخیره تغییرات
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">ناحیه خطر</CardTitle>
          <CardDescription>
            این عملیات غیرقابل بازگشت است. لطفاً دقت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteLoading} className="gap-2">
                   {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                   حذف پروژه
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="text-right" dir="rtl">
                <AlertDialogHeader className="text-right space-y-3">
                  <AlertDialogTitle>آیا کاملاً مطمئن هستید؟</AlertDialogTitle>
                  <AlertDialogDescription>
                    این عملیات غیرقابل بازگشت است. پروژه
                    <span className="font-bold text-foreground mx-1">&quot;{project.title}&quot;</span>
                    و تمام استراتژی‌ها و برنامه‌های مرتبط با آن برای همیشه حذف خواهند شد.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-start gap-2">
                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    حذف پروژه
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
           </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
