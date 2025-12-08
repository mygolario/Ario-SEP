import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import GenerateFundingButton from "@/components/projects/GenerateFundingButton";
import { FundingPlanData } from "@/lib/types";
import { DollarSign, Target, Calendar, TrendingUp, AlertTriangle, Wallet } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FundingRoadmapPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  const fundingRoadmap = await prisma.fundingRoadmap.findUnique({
    where: { ideaIntakeId: id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  const funding = fundingRoadmap?.data as unknown as FundingPlanData | null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header */}
        <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            نقشه راه تأمین مالی
            </h1>
            <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، می‌بینی در چند مرحله کلی به چه نوع منابع مالی نیاز داری، پول کجا خرج می‌شود و هدف هر مرحله چیست.
            </p>
        </div>

        {/* Idea summary card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            خلاصه مشخصات پروژه
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-[13px]">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">ایده کلی</span>
              <p className="text-slate-800 font-medium">{project.ideaOneLiner}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">مخاطب</span>
              <p className="text-slate-800">{project.audience}</p>
            </div>
          </div>
        </div>

        {!funding ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
                <div className="bg-indigo-50 p-4 rounded-full">
                <DollarSign className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز نقشه راه تأمین مالی ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی یک نقشه راه اولیه برای مدیریت پول و جذب سرمایه بر اساس همین ایده بسازی.</p>
                </div>
                <GenerateFundingButton projectId={id} />
            </div>
        ) : (
            <div className="space-y-8">
                {/* Overall Strategy */}
                <div className="rounded-2xl border border-indigo-100 bg-white p-5 md:p-6 space-y-3 shadow-sm ring-1 ring-indigo-50">
                     <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h2 className="text-base md:text-lg font-bold text-slate-900">
                             {funding.overallStrategy.title || "رویکرد کلی تأمین مالی"}
                        </h2>
                    </div>
                    <p className="text-[13px] md:text-sm text-slate-700 leading-7 whitespace-pre-line text-justify">
                        {funding.overallStrategy.description}
                    </p>
                </div>

                {/* Timeline */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6 space-y-4">
                     <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        مراحل کلی مسیر
                    </h2>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2 pt-2">
                        {funding.phases
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((phase, index, arr) => (
                            <div key={phase.id} className="flex items-center md:flex-1 gap-2 md:gap-0 md:flex-col relative">
                                {/* Connector Line (Desktop) */}
                                {index < arr.length - 1 && (
                                    <div className="hidden md:block absolute top-[15px] right-[50%] w-full h-[2px] bg-slate-300 z-0" />
                                )}
                                
                                <div className="z-10 flex flex-col items-center gap-2 w-full md:w-auto">
                                     <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-[12px] font-bold flex items-center justify-center ring-4 ring-slate-50">
                                        {phase.order}
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-800 text-center md:max-w-[120px]">
                                        {phase.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phases Detail */}
                <div className="space-y-6">
                    {funding.phases
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((phase) => (
                        <div
                            key={phase.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold w-8 h-8">
                                    {phase.order}
                                    </span>
                                    <div>
                                         <h3 className="text-base md:text-lg font-bold text-slate-900">
                                            {phase.title}
                                        </h3>
                                        <span className="text-[11px] text-slate-500 block md:hidden mt-0.5">{phase.timeframe}</span>
                                    </div>
                                </div>
                                <span className="hidden md:inline-flex px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                    {phase.timeframe}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                     <div>
                                        <h4 className="text-[12px] font-bold text-slate-500 mb-1">هدف این مرحله</h4>
                                        <p className="text-[13px] md:text-sm text-slate-800 leading-6 font-medium">
                                            {phase.goal}
                                        </p>
                                     </div>
                                     <div>
                                        <h4 className="text-[12px] font-bold text-slate-500 mb-1">وضعیت مالی</h4>
                                        <p className="text-[13px] text-slate-700 leading-6 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-justify">
                                            {phase.amountSummary}
                                        </p>
                                     </div>
                                </div>

                                <div className="space-y-4">
                                     {phase.spendCategories && phase.spendCategories.length > 0 && (
                                        <div>
                                            <h4 className="text-[12px] font-bold text-slate-500 mb-2 flex items-center gap-1">
                                                <Wallet className="h-3 w-3" />
                                                مهم‌ترین خرج‌ها
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {phase.spendCategories.map((cat, idx) => (
                                                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                        <span className="block text-[12px] font-bold text-slate-900">{cat.name}</span>
                                                        <span className="block text-[11px] text-slate-600 mt-0.5">{cat.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                     )}
                                </div>
                            </div>
                            
                            {/* Milestones & Risks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                 {phase.milestones && phase.milestones.length > 0 && (
                                    <div className="bg-indigo-50/30 rounded-xl p-4 border border-indigo-100">
                                        <h4 className="text-[12px] font-bold text-indigo-900 mb-2">خروجی‌های کلیدی (Milestones)</h4>
                                        <ul className="space-y-1.5">
                                            {phase.milestones.map((m, i) => (
                                                <li key={i} className="flex gap-2 text-[12px] text-indigo-800">
                                                    <span className="text-indigo-400 mt-0.5">•</span>
                                                    {m}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {phase.risks && phase.risks.length > 0 && (
                                    <div className="bg-amber-50/30 rounded-xl p-4 border border-amber-100">
                                        <h4 className="text-[12px] font-bold text-amber-900 mb-2 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            ریسک‌ها
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {phase.risks.map((r, i) => (
                                                <li key={i} className="flex gap-2 text-[12px] text-amber-800">
                                                    <span className="text-amber-400 mt-0.5">•</span>
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        ))}
                </div>

                {/* General Notes */}
                {funding.generalNotes && funding.generalNotes.length > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-6 space-y-3">
                        <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            نکات طلایی مدیریت پول
                        </h2>
                        <ul className="space-y-2 text-[13px] text-emerald-900 leading-6">
                            {funding.generalNotes.map((note, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="font-bold text-emerald-500">•</span>
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
        )}
      </div>
    </main>
  );
}
