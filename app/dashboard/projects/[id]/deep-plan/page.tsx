
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import GenerateDeepPlanButton from "@/components/projects/GenerateDeepPlanButton";
import { DeepPlanData } from "@/lib/types";
import { CheckCircle2, AlertTriangle, Target, Clock, ArrowUpRight, BarChart3, Layers, Zap } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeepPlanPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  const deepPlan = await prisma.deepPlan.findFirst({
    where: { ideaIntakeId: id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  /* 
     Legacy data check: 
     Some projects might have old-format deep plans. We must validate the new structure exists.
     If old structure is found, we treat it as null so the user can re-generate with the new format.
  */
  const rawPlan = deepPlan?.data as any;
  const isValidPlan = rawPlan && 
                      rawPlan.overview && 
                      rawPlan.customerAndProblem && 
                      rawPlan.solutionAndProduct &&
                      rawPlan.roadmap90Days &&
                      rawPlan.risks &&
                      rawPlan.metrics;

  const plan = isValidPlan ? (rawPlan as DeepPlanData) : null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header section */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            برنامه عمیق برای این ایده
          </h1>
          <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، یک نگاه مرحله‌به‌مرحله به مسیر اجرای ایده‌ات می‌بینی؛ از شروع تا ساخت نسخه اولیه و گام‌های بعدی.
          </p>
        </div>

        {/* Idea summary card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            خلاصه ایده در یک نگاه
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-[13px]">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">ایده در یک جمله</span>
              <p className="text-slate-800 font-medium">{project.ideaOneLiner}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">مخاطب اصلی</span>
              <p className="text-slate-800">{project.audience}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">مشکل اصلی</span>
              <p className="text-slate-800">{project.problem}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">راه‌حل پیشنهادی</span>
              <p className="text-slate-800">{project.solution}</p>
            </div>
          </div>
        </div>

        {!plan ? (
           <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
             <div className="bg-indigo-50 p-4 rounded-full">
                <Target className="h-8 w-8 text-indigo-600" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز برای این ایده برنامه عمیق ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی یک برنامه عمیق اولیه شامل تحلیل بازار، مسیر اجرا و ریسک‌ها بر اساس اطلاعات همین ایده بسازی.</p>
             </div>
             <GenerateDeepPlanButton projectId={id} />
           </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5 text-indigo-600" />
                        {plan.overview.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {plan.overview.description}
                    </p>
                    {plan.overview.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {plan.overview.bullets.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>

                {/* 2. Customer & Problem */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                         <Target className="h-5 w-5 text-rose-500" />
                        {plan.customerAndProblem.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {plan.customerAndProblem.description}
                    </p>
                    {plan.customerAndProblem.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {plan.customerAndProblem.bullets.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>
            </div>

            {/* 3. Solution & Product */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    {plan.solutionAndProduct.title}
                </h2>
                <p className="text-[13px] text-slate-700 leading-7 text-justify">
                    {plan.solutionAndProduct.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {plan.solutionAndProduct.bullets?.map((item, i) => (
                         <div key={i} className="flex items-start gap-2 text-[13px] text-slate-800 bg-slate-50 p-3 rounded-xl">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                         </div>
                    ))}
                </div>
            </div>

            {/* 4. Roadmap 90 Days */}
            <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-indigo-50 to-white p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-700" />
                    {plan.roadmap90Days.title}
                </h2>
                <p className="text-[13px] text-slate-700 leading-7">
                    {plan.roadmap90Days.description}
                </p>
                <div className="space-y-2">
                     {plan.roadmap90Days.bullets?.map((item, i) => (
                        <div key={i} className="flex gap-3 items-center bg-white border border-indigo-100 p-3 rounded-xl shadow-xs">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
                                {i + 1}
                             </span>
                             <span className="text-[13px] text-slate-800">{item}</span>
                        </div>
                     ))}
                </div>
            </div>

            {/* 5. Risks & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        {plan.risks.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {plan.risks.description}
                    </p>
                     {plan.risks.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {plan.risks.bullets.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        {plan.metrics.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {plan.metrics.description}
                    </p>
                    {plan.metrics.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {plan.metrics.bullets.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
