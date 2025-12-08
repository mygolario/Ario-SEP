import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Lock, FileText, Target, Lightbulb, Users } from "lucide-react";
import { ToolCard } from "@/components/projects/ToolCard";
import { AISummaryBox } from "@/components/projects/AISummaryBox";

interface Props {
  params: Promise<{
    id: string;
  }>;
}



export default async function ProjectSummaryPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  // @ts-ignore: Stale Prisma types due to running server
  const projectData = project as any;

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
    { name: "برنامه عمیق (Deep Plan)", slug: "deep-plan" },
    { name: "هویت برند (Branding Kit)", slug: "branding-kit" },
    { name: "استراتژی لندینگ", slug: "landing" },
    { name: "تحلیل بازار و رقبا", slug: "market" },
    { name: "Pitch Deck", slug: "pitch-deck" },
    { name: "نقشه راه تأمین مالی", slug: "funding" },
    { name: "کوچ اجرا (Tasks)", slug: "tasks" },
  ];

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">خلاصه و ابزارهای این ایده</h1>
        <p className="text-sm md:text-[13px] text-slate-600 leading-6">
          از اینجا می‌توانی همه ابزارهای تحلیلی و اجرایی مربوط به این ایده را ببینی و بین آن‌ها جابه‌جا شوی.
        </p>
      </div>

      {/* Idea Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            ایده: <span className="text-indigo-700">{project.ideaOneLiner}</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] md:text-[13px] text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                مشکل اصلی
            </p>
            <p className="leading-6">{project.problem}</p>
            </div>
            <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Target className="w-3 h-3" />
                راه‌حل پیشنهادی
            </p>
            <p className="leading-6">{project.solution}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3" />
                مخاطب هدف
            </p>
            <p className="leading-6">{project.audience}</p>
            </div>
        </div>
      </div>

      {/* AI Summary (Optional - kept if it exists) */}
       <AISummaryBox 
        projectId={project.id} 
        initialSummary={project.aiSummary} 
        isAdmin={user.role === "ADMIN"} 
      />

      {/* Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-base md:text-lg font-bold text-slate-900 pr-2 border-r-4 border-indigo-500">
            ابزارهای پیشرفته برای این ایده
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <ToolCard
                title="برنامه عمیق"
                description="مسیر مرحله‌به‌مرحله اجرای ایده، از شروع تا رشد."
                href={`/dashboard/projects/${project.id}/deep-plan`}
                hasData={!!projectData.deepPlan}
            />

            <ToolCard
                title="بسته برند"
                description="نام، شعار، شخصیت، لحن و پالت رنگ پیشنهادی برند."
                href={`/dashboard/projects/${project.id}/branding-kit`}
                hasData={!!projectData.brandingKit}
            />

            <ToolCard
                title="ساختار لندینگ"
                description="چینش بخش‌های صفحه لندینگ، تیترها و متن‌های پیشنهادی."
                href={`/dashboard/projects/${project.id}/landing`}
                hasData={!!projectData.landingPagePlan} // Note: field name in schema is landingPagePlan
            />

            <ToolCard
                title="تحلیل بازار و رقبا"
                description="تصویر کلی بازار، بخش‌های مشتری، رقبا، فرصت‌ها و ریسک‌ها."
                href={`/dashboard/projects/${project.id}/market`}
                hasData={!!projectData.marketAnalysis}
            />

            <ToolCard
                title="طرح ارائه برای سرمایه‌گذار"
                description="اسکلت اسلایدهای ارائه: مشکل، راه‌حل، بازار، تیم و درخواست سرمایه."
                href={`/dashboard/projects/${project.id}/pitch-deck`}
                hasData={!!projectData.pitchDeck}
            />

            <ToolCard
                title="نقشه راه تأمین مالی"
                description="مراحل کلی تأمین مالی، خرج‌ها و خروجی‌های هر مرحله."
                href={`/dashboard/projects/${project.id}/funding`}
                hasData={!!projectData.fundingRoadmap} // Note: field name in schema is fundingRoadmap
            />

            <ToolCard
                title="کوچ اجرا و فهرست کارها"
                description="برنامه هفتگی برای تسک‌های مهم شروع کار روی همین ایده."
                href={`/dashboard/projects/${project.id}/tasks`}
                hasData={!!projectData.executionPlan}
            />
        </div>
      </div>

      </div>
    </main>
  );
}
