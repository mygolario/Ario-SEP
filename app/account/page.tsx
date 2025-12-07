import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">حساب کاربری و تنظیمات</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>پروفایل</CardTitle>
            <CardDescription>اطلاعات شخصی شما.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || ''} alt={user.name || ''} />
              <AvatarFallback className="text-xl">{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>طرح اشتراک</CardTitle>
            <CardDescription>مدیریت وضعیت اشتراک پلتفرم.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border">
                <p className="font-medium">طرح رایگان</p>
                <p className="text-sm text-muted-foreground">شما در حال استفاده از نسخه رایگان هستید.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
