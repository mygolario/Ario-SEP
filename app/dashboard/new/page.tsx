import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import IdeaIntakeForm from "@/components/IdeaIntakeForm";

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 space-y-6">
        <div className="space-y-2 text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            ساخت پروژه جدید
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            با پاسخ‌دادن به چند سؤال ساده، برای ایده‌ات یک خلاصه‌ی یک‌صفحه‌ای می‌سازیم.
          </p>
        </div>
        <IdeaIntakeForm />
      </div>
    </main>
  );
}
