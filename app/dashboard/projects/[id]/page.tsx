import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Lock, FileText, Target, Lightbulb, Users } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProjectSummaryPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const project = await prisma.ideaIntake.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">پروژه یافت نشد</h1>
        <p className="text-slate-600">ممکن است حذف شده باشد یا دسترسی نداشته باشید.</p>
      </div>
    );
  }

  if (project.userId !== user.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">دسترسی غیرمجاز</h1>
        <p className="text-slate-600">شما اجازه مشاهده این پروژه را ندارید.</p>
      </div>
    );
  }

  const baseDetails = [
    {
      title: "ایده در یک جمله",
      content: project.ideaOneLiner,
      icon: <Lightbulb className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: "مشکل / نیاز",
      content: project.problem,
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: "راه‌حل پیشنهادی",
      content: project.solution,
      icon: <Target className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: "مشتری هدف",
      content: project.audience,
      icon: <Users className="w-5 h-5 text-indigo-600" />,
    },
  ];

  const lockedFeatures = [
    "برنامه عمیق (Deep Plan)",
    "هویت برند (Branding Kit)",
    "استراتژی لندینگ",
    "تحلیل بازار و رقبا",
    "Pitch Deck",
    "نقشه راه تأمین مالی",
    "کوچ اجرا (Tasks)",
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10" dir="rtl">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">خلاصه یک‌صفحه‌ای</h1>
        <p className="text-slate-600 text-lg">
          بر اساس اطلاعاتی که وارد کردی، این خلاصه‌ی اولیه‌ی ایده‌ی توست.
        </p>
      </div>

      {/* Base Idea Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {baseDetails.map((item, index) => (
          <div key={index} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900">{item.title}</h3>
            </div>
            <p className="text-slate-700 text-sm leading-7 whitespace-pre-wrap">
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* AI Summary Placeholder */}
      <div className="p-8 bg-linear-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">خلاصه تحلیلی هوشمند (AI)</h3>
        </div>
        <p className="text-slate-700 leading-8">
          این بخش در نسخه‌ی نهایی توسط هوش مصنوعی تولید می‌شود و شامل خلاصه‌ی تحلیلی، ارزش پیشنهادی منحصر‌به‌فرد، و نقاط قوت و ضعف احتمالی ایده‌ی شما خواهد بود.
          <br/>
          (این قابلیت در حال پیاده‌سازی است...)
        </p>
      </div>

      {/* Locked Features */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">ابزارهای پیشرفته</h2>
          <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
            نسخه پرمیوم
          </span>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lockedFeatures.map((feature, idx) => (
            <div key={idx} className="relative p-6 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Lock className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-500">نیازمند اشتراک</span>
              </div>
              <div className="flex items-center justify-between opacity-60">
                <h3 className="font-semibold text-slate-800">{feature}</h3>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
            <a href="/pricing" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors w-full sm:w-auto">
                مشاهده پلن‌های اشتراک
            </a>
        </div>
      </div>

    </div>
  );
}
