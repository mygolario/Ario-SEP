import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
    tool: string;
  }>;
}

const TOOL_TITLES: Record<string, string> = {
  "deep-plan": "برنامه عمیق (Deep Plan)",
  "branding-kit": "هویت برند (Branding Kit)",
  "landing": "استراتژی لندینگ",
  "market": "تحلیل بازار و رقبا",
  "pitch-deck": "Pitch Deck",
  "funding": "نقشه راه تأمین مالی",
  "tasks": "کوچ اجرا (Tasks)",
};

export default async function ToolPlaceholderPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id, tool } = await params;
  const toolTitle = TOOL_TITLES[tool] || "ابزار ناشناخته";

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  if (!project || project.userId !== user.id) {
    redirect("/dashboard/projects");
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb / Back */}
        <Link 
          href={`/dashboard/projects/${id}`}
          className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          بازگشت به خلاصه پروژه
        </Link>

        {/* Header */}
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {toolTitle}
          </h1>
          <p className="text-slate-600">
            پروژه: <span className="font-semibold text-slate-800">{project.ideaOneLiner}</span>
          </p>
        </div>

        {/* Content */}
        {isAdmin ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🛠️</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">این ابزار در حال توسعه است</h2>
                <p className="text-slate-600 max-w-lg mx-auto leading-7">
                    شما به عنوان <b>ادمین</b> به این صفحه دسترسی دارید. در نسخه‌های آینده، اینجا محل پیاده‌سازی و نمایش خروجی‌های هوش مصنوعی برای «{toolTitle}» خواهد بود.
                </p>
            </div>
        ) : (
            <div className="bg-white border border-amber-200 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-sm">
                <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-2">
                    <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">این قابلیت قفل است</h2>
                    <p className="text-slate-600 max-w-md mx-auto leading-7">
                        برای دسترسی به <b>{toolTitle}</b> و سایر ابزارهای پیشرفته، لطفاً حساب کاربری خود را به پلن حرفه‌ای ارتقا دهید.
                    </p>
                </div>
                <Link 
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                    مشاهده پلن‌ها و ارتقا
                </Link>
            </div>
        )}
      </div>
    </main>
  );
}
