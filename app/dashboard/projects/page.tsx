import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { PlusCircle, Lightbulb, FileText, Calendar } from "lucide-react";

export default async function ProjectsListPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const projects = await prisma.ideaIntake.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              پروژه‌های شما
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
              لیست تمام ایده‌ها و برنامه‌هایی که ثبت کرده‌اید.
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <PlusCircle className="me-2 h-4 w-4" />
            پروژه جدید
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">هنوز پروژه‌ای ندارید</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-sm">
                 اولین ایده خود را ثبت کنید تا هوش مصنوعی برای آن برنامه اجرایی بسازد.
            </p>
             <Link
                href="/dashboard/new"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition"
              >
                شروع اولین پروژه
              </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:gap-5">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group block">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group-hover:translate-x-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {project.ideaOneLiner || "ایده بدون عنوان"}
                      </h2>
                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(project.createdAt).toLocaleDateString('fa-IR')}</span>
                       </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 md:line-clamp-1">
                         <span className="font-medium text-slate-700 dark:text-slate-300">مسئله: </span>
                        {project.problem}
                      </p>
                    </div>
                     <div className="flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        مشاهده جزئیات
                        <PlusCircle className="h-4 w-4 ms-1 rotate-45" /> {/* Using PlusCircle rotated as arrow alternative if preferred, or generic arrow */}
                     </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
