
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import DeepPlanGenerator from "@/components/DeepPlanGenerator";
import { DeepPlanData } from "@/lib/types";
import { CheckCircle2, AlertTriangle, Target, Clock, ArrowUpRight } from "lucide-react";

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

  const plan = deepPlan?.data as unknown as DeepPlanData | null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* 3) Header section */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            برنامه عمیق برای این ایده
          </h1>
          <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، یک نگاه مرحله‌به‌مرحله به مسیر اجرای ایده‌ات می‌بینی؛ از شروع تا ساخت نسخه اولیه و گام‌های بعدی.
          </p>
        </div>

        {/* 4) Idea summary card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-600" />
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

        {!deepPlan ? (
           <div className="mt-8">
             <DeepPlanGenerator projectId={id} />
           </div>
        ) : (
          <>
            {/* 5) Main deep plan content area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {/* Block 1: مسیر کلی */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 flex flex-col gap-3 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    مسیر کلی حرکت
                 </h3>
                 <p className="text-[13px] text-slate-600 leading-6 text-justify">
                   {plan?.overview?.marketSummary || "تحلیل کلی بازار و مسیر پیش روی شما برای ورود و موفقیت."}
                 </p>
                 
                 <div className="flex items-center justify-between gap-2 mt-auto pt-4">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      ۱
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">تست</p>
                  </div>
                  <div className="h-px flex-1 bg-slate-200" />
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      ۲
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">ساخت</p>
                  </div>
                  <div className="h-px flex-1 bg-slate-200" />
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      ۳
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500">رشد</p>
                  </div>
                </div>
              </div>

              {/* Block 2: گام‌های سه‌ماهه */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 flex flex-col gap-3 shadow-sm md:col-span-1">
                 <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    گام‌های بعدی
                 </h3>
                 <ul className="space-y-3 text-[12px] md:text-[13px] text-slate-700">
                    {plan?.extendedRoadmap?.slice(0, 3).map((phase, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                         <span className="font-semibold text-slate-900 whitespace-nowrap">{phase.phase || `فاز ${idx + 1}`}:</span>
                         <span className="text-slate-600 leading-5">{phase.items?.[0] || "اقدام کلیدی این مرحله"}</span>
                      </li>
                    )) || (
                      <>
                        <li><span className="font-semibold text-slate-900">فاز ۱:</span> تحقیقات بازار و مصاحبه</li>
                        <li><span className="font-semibold text-slate-900">فاز ۲:</span> ساخت نسخه MVP</li>
                        <li><span className="font-semibold text-slate-900">فاز ۳:</span> جذب کاربران اولیه</li>
                      </>
                    )}
                 </ul>
              </div>

              {/* Block 3: ریسک‌ها */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 flex flex-col gap-3 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ریسک‌ها و موانع
                 </h3>
                 <ul className="space-y-2 text-[12px] md:text-[13px] text-slate-700 list-disc pr-4">
                    {plan?.risks?.slice(0, 4).map((risk, idx) => (
                        <li key={idx}>{risk.risk || "ریسک احتمالی"}</li>
                    )) || (
                       <>
                        <li>عدم اعتبار‌سنجی کافی ایده</li>
                        <li>کمبود کانال‌های بازاریابی مناسب</li>
                        <li>پیچیدگی فنی پیش‌بینی نشده</li>
                       </> 
                    )}
                 </ul>
              </div>
            </div>

            {/* 6) Visual roadmap section */}
            <div className="rounded-2xl border border-slate-200 bg-linear-to-tr from-slate-50 to-indigo-50 p-5 md:p-6 space-y-4">
              <h2 className="text-sm md:text-base font-bold text-slate-900">
                نمودار مسیر اجرای ایده
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 text-[11px] md:text-[12px]">
                {plan?.extendedRoadmap?.map((phase, idx) => (
                  <div key={idx} className="rounded-xl bg-white/80 border border-slate-200 px-3 py-3 flex flex-col gap-1 shadow-sm">
                    <span className="text-[10px] text-slate-500 font-medium">مرحله {idx + 1}</span>
                    <p className="text-[12px] font-bold text-slate-900 line-clamp-1">
                      {phase.phase}
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-4">
                      {phase.items?.join('، ') || "تمرکز روی اهداف اصلی این فاز"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7) Key notes section */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 md:p-6 space-y-3">
              <h2 className="text-sm md:text-base font-bold text-amber-900 flex items-center gap-2">
                 <CheckCircle2 className="h-4 w-4" />
                 نکات کلیدی برای صاحب ایده
              </h2>
              <ul className="space-y-1.5 text-[12px] md:text-[13px] text-amber-900 list-disc pr-4 leading-6">
                <li>در ماه‌های اول تمرکزت را روی یادگیری از مشتری بگذار، نه اضافه‌کردن فیچرهای جدید.</li>
                <li>قبل از هر خرج بزرگ، مطمئن شو حداقل چند نفر حاضرند برای راه‌حل تو پول پرداخت کنند.</li>
                <li>این برنامه عمیق یک نقطه شروع است؛ آن را با واقعیت بازار و تجربه‌های خودت به‌روز کن.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
