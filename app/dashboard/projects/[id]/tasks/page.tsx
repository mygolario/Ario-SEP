import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExecutionPlanData } from "@/lib/types";
import GenerateExecutionPlanButton from "@/components/projects/GenerateExecutionPlanButton";
import { ListTodo, CheckSquare, Calendar, Target, Clock, Activity } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TasksPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  // @ts-ignore: Stale Prisma types due to running server
  const execution = (project as any).executionPlan as unknown as ExecutionPlanData | null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header */}
        <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            کوچ اجرا و فهرست کارهای شروع
            </h1>
            <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، یک برنامه ساده و عملی برای چند هفته اول اجرای ایده‌ات می‌بینی؛ با تسک‌های مشخص و قابل انجام.
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
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">مشکل</span>
              <p className="text-slate-800">{project.problem}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-slate-500">راه‌حل</span>
              <p className="text-slate-800">{project.solution}</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!execution ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
                <div className="bg-indigo-50 p-4 rounded-full">
                <ListTodo className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز برای این ایده برنامه اجرای اولیه ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی یک برنامه پیشنهادی برای چند هفته اول اجرا بر اساس همین ایده بسازی.</p>
                </div>
                <GenerateExecutionPlanButton projectId={id} />
            </div>
        ) : (
            <div className="space-y-8">
                {/* Summary Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-3 shadow-sm">
                    <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-600" />
                        {execution.summary.title || "رویکرد کلی اجرای چند هفته اول"}
                    </h2>
                    <p className="text-sm md:text-[13px] text-slate-700 leading-7 whitespace-pre-line text-justify">
                        {execution.summary.description}
                    </p>
                </div>

                {/* Timeline */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 md:p-6 space-y-4">
                    <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        مسیر چند هفته اول
                    </h2>
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-3 pt-2">
                        {execution.weeks
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((week, index, arr) => (
                            <div key={week.id} className="flex items-center md:flex-1 gap-2 md:flex-col md:gap-3 relative">
                                {/* Connector Line (Desktop) */}
                                {index < arr.length - 1 && (
                                    <div className="hidden md:block absolute top-[15px] right-[50%] w-full h-[2px] bg-slate-300 z-0" />
                                )}

                                <div className="z-10 flex flex-col items-center gap-1 w-full md:w-auto">
                                    <div className="h-8 w-8 rounded-full bg-slate-900 text-white text-[12px] font-bold flex items-center justify-center ring-4 ring-indigo-50">
                                        {week.order}
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-800 text-center line-clamp-2 md:max-w-[120px]">
                                        {week.label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Tasks */}
                <div className="space-y-6">
                    {execution.weeks
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((week) => (
                        <div
                            key={week.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-sm font-bold w-8 h-8">
                                    {week.order}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {week.label}
                                    </h3>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-[12px] md:text-[13px] text-slate-700 leading-6 font-medium">
                                    <span className="text-slate-500 ml-1">تمرکز هفته:</span>
                                    {week.focus}
                                </p>
                            </div>

                            {/* Task grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {week.tasks.map((task) => (
                                    <div
                                    key={task.id}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex flex-col gap-3 hover:border-indigo-200 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                           <div className="flex items-start gap-2">
                                                <CheckSquare className="h-4 w-4 text-slate-400 mt-1 shrink-0" />
                                                <p className="text-[13px] font-bold text-slate-900 leading-6">
                                                    {task.title}
                                                </p>
                                           </div>
                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 shrink-0">
                                                {task.category}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="text-[12px] text-slate-600 leading-5 text-justify pr-6">
                                            {task.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pr-6 pt-1 border-t border-slate-50 mt-auto">
                                            {task.suggestedDuration && (
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                                    <Clock className="h-3 w-3" />
                                                    {task.suggestedDuration}
                                                </span>
                                            )}
                                            {task.difficulty && (
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                                     <Activity className="h-3 w-3" />
                                                    {task.difficulty}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        ))}
                </div>

                {/* Reminders */}
                {execution.reminders && execution.reminders.length > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-6 space-y-3">
                        <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            چند یادآوری مهم در طول مسیر
                        </h2>
                        <ul className="space-y-2 text-[13px] text-emerald-900 leading-6 pr-4 list-disc marker:text-emerald-500">
                            {execution.reminders.map((item, idx) => (
                                <li key={idx} className="pl-2">{item}</li>
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
