import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import GenerateLandingPlanButton from "@/components/projects/GenerateLandingPlanButton";
import { LandingPlanData } from "@/lib/types";
import { LayoutTemplate, Target, Zap, Layout } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LandingPlanPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  const landingPagePlan = await prisma.landingPagePlan.findFirst({
    where: { ideaIntakeId: id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  // Validate wrapper for legacy data safely
  const rawPlan = landingPagePlan?.data as any;
  const isValidPlan = rawPlan && rawPlan.hero && rawPlan.finalCta;

  const plan = isValidPlan ? (rawPlan as LandingPlanData) : null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            ساختار لندینگ برای این ایده
          </h1>
          <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، یک طرح کامل برای صفحه لندینگ این ایده می‌بینی؛ از بخش بالای صفحه تا دعوت به اقدام نهایی.
          </p>
        </div>

        {/* Idea summary card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            خلاصه مشخصات ایده
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

        {!plan ? (
           <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
             <div className="bg-indigo-50 p-4 rounded-full">
                <LayoutTemplate className="h-8 w-8 text-indigo-600" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز برای این ایده ساختار لندینگ ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی بر اساس همین اطلاعات، یک ساختار اولیه برای صفحه لندینگ بسازی.</p>
             </div>
             <GenerateLandingPlanButton projectId={id} />
           </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
               <Layout className="h-5 w-5 text-indigo-600" />
               <h2 className="text-sm md:text-base font-semibold text-slate-900">
                 پیش‌نمایش ساختار صفحه
               </h2>
            </div>
          
            <div className="space-y-4 text-right text-[12px] md:text-[13px] max-w-3xl mx-auto">
                {/* Hero */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-6 py-8 space-y-4 text-center">
                    <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold">بخش بالای صفحه (Hero)</p>
                    <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-snug">
                        {plan.hero.title}
                    </h3>
                    {plan.hero.subtitle && (
                        <p className="text-sm text-slate-600 leading-7 max-w-xl mx-auto">
                        {plan.hero.subtitle}
                        </p>
                    )}
                     <div className="flex flex-col items-center gap-3 pt-2">
                        {plan.hero.highlightText && (
                            <div className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm md:text-base font-semibold text-white shadow-lg shadow-indigo-500/20">
                            {plan.hero.highlightText}
                            </div>
                        )}
                        {plan.hero.bullets && (
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                                {plan.hero.bullets.map((b, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-white/50 px-2 py-1 rounded-md border border-indigo-50">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        {b}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Problem */}
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 px-6 py-6 space-y-3">
                    <p className="text-[10px] text-rose-400 uppercase tracking-wider font-bold">بخش مشکل</p>
                    <h3 className="text-base font-bold text-slate-900">
                        {plan.problem.title}
                    </h3>
                    {plan.problem.body && (
                        <p className="text-slate-700 leading-7">
                        {plan.problem.body}
                        </p>
                    )}
                    {plan.problem.bullets && (
                        <ul className="mt-2 space-y-1.5 list-disc pr-4 text-slate-600">
                        {plan.problem.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                    )}
                </div>

                {/* Solution */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-6 py-6 space-y-3">
                     <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-bold">بخش راه‌حل</p>
                    <h3 className="text-base font-bold text-slate-900">
                        {plan.solution.title}
                    </h3>
                    {plan.solution.body && (
                        <p className="text-slate-700 leading-7">
                        {plan.solution.body}
                        </p>
                    )}
                     {plan.solution.bullets && (
                        <ul className="mt-2 space-y-1.5 list-disc pr-4 text-slate-600">
                        {plan.solution.bullets.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                    )}
                </div>

                {/* Features */}
                <div className="rounded-xl border border-slate-200 bg-white px-6 py-6 space-y-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ویژگی‌ها</p>
                    <h3 className="text-base font-bold text-slate-900">
                        {plan.features.title}
                    </h3>
                     {plan.features.bullets && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                             {plan.features.bullets.map((b, i) => (
                                <div key={i} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                    <span className="text-slate-700 leading-5">{b}</span>
                                </div>
                             ))}
                        </div>
                    )}
                </div>

                 {/* Steps */}
                 <div className="rounded-xl border border-amber-100 bg-amber-50/50 px-6 py-6 space-y-3">
                    <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">چطور کار می‌کند؟</p>
                    <h3 className="text-base font-bold text-slate-900">
                        {plan.steps.title}
                    </h3>
                    {plan.steps.bullets && (
                        <div className="space-y-2 mt-2">
                            {plan.steps.bullets.map((b, i) => (
                                <div key={i} className="flex items-center gap-3">
                                     <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white border border-amber-200 text-amber-700 text-xs font-bold shadow-xs shrink-0">{i+1}</span>
                                     <span className="text-slate-800">{b}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Social Proof */}
                <div className="rounded-xl border border-sky-100 bg-sky-50/50 px-6 py-6 space-y-3 text-center">
                    <p className="text-[10px] text-sky-600 uppercase tracking-wider font-bold">تایید اجتماعی</p>
                    <h3 className="text-base font-bold text-slate-900">
                        {plan.socialProof.title}
                    </h3>
                    {plan.socialProof.body && <p className="text-slate-600">{plan.socialProof.body}</p>}
                    {plan.socialProof.bullets && (
                         <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {plan.socialProof.bullets.map((b, i) => (
                                <div key={i} className="bg-white px-4 py-2 rounded-full border border-sky-100 text-sky-800 text-xs font-medium shadow-xs">
                                     "{b}"
                                </div>
                            ))}
                         </div>
                    )}
                </div>

                 {/* FAQ */}
                 <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-6 space-y-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">سوالات متداول</p>
                    <h3 className="text-base font-bold text-slate-900">
                        {plan.faq.title}
                    </h3>
                     {plan.faq.bullets && (
                        <div className="space-y-3 mt-2">
                            {plan.faq.bullets.map((b, i) => (
                                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 text-sm">
                                    {b}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                 {/* Final CTA */}
                 <div className="rounded-xl border border-indigo-200 bg-indigo-600 px-6 py-10 text-center space-y-4 shadow-lg shadow-indigo-200">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                        {plan.finalCta.title}
                    </h3>
                    {plan.finalCta.body && (
                        <p className="text-indigo-100 max-w-lg mx-auto leading-7">
                        {plan.finalCta.body}
                        </p>
                    )}
                    {plan.finalCta.highlightText && (
                        <div className="mt-4">
                             <button className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-md">
                                 {plan.finalCta.highlightText}
                             </button>
                        </div>
                    )}
                 </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function CheckCircle2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
