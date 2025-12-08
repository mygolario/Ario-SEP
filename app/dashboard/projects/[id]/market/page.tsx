import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import GenerateMarketAnalysisButton from "@/components/projects/GenerateMarketAnalysisButton";
import { MarketAnalysisData } from "@/lib/types";
import { TrendingUp, Users, Target, Layers, AlertTriangle, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketAnalysisPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  const marketAnalysis = await prisma.marketAnalysis.findUnique({
    where: { ideaIntakeId: id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  const market = marketAnalysis?.data as unknown as MarketAnalysisData | null;
  
  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header */}
        <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            تحلیل بازار و رقبا
            </h1>
            <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، تصویر کلی بازار، بخش‌های مختلف مشتریان، رقبا، فرصت‌ها و ریسک‌های اصلی ایده‌ات را می‌بینی.
            </p>
        </div>

        {/* Idea summary card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
          <h2 className="text-sm md:text-base font-bold text-slate-900 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
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

        {!market ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
                <div className="bg-indigo-50 p-4 rounded-full">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز برای این ایده تحلیل بازار ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی یک تحلیل اولیه از بازار و رقبا بر اساس همین اطلاعات بسازی.</p>
                </div>
                <GenerateMarketAnalysisButton projectId={id} />
            </div>
        ) : (
            <div className="space-y-8">
                {/* Overview */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-3 shadow-sm">
                    <h2 className="text-sm md:text-base font-semibold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                        {market.overview.title || "نمای کلی بازار"}
                    </h2>
                    <p className="text-sm md:text-[13px] text-slate-700 leading-7 text-justify">
                        {market.overview.description}
                    </p>
                </div>

                {/* Segments */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        بخش‌های اصلی بازار
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {market.segments.map((segment) => (
                            <div
                            key={segment.name}
                            className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 hover:border-indigo-200 transition-colors"
                            >
                            <h3 className="text-base font-bold text-slate-900">
                                {segment.name}
                            </h3>
                            <p className="text-[12px] md:text-[13px] text-slate-600 leading-6">
                                {segment.description}
                            </p>
                            {segment.needs && segment.needs.length > 0 && (
                                <div className="pt-2">
                                    <p className="text-[11px] font-semibold text-slate-500 mb-1">نیازها و دغدغه‌ها:</p>
                                    <ul className="space-y-1 text-[11px] md:text-[12px] text-slate-700 list-disc pr-4">
                                    {segment.needs.map((need, i) => (
                                        <li key={i}>{need}</li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Layers (TAM/SAM/SOM) */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 md:p-6 space-y-4">
                     <h2 className="text-sm md:text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-indigo-600" />
                        لایه‌های بازار (TAM / SAM / SOM)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm space-y-2">
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">TAM</span>
                            <h4 className="font-bold text-slate-900 text-sm">کل بازار بالقوه</h4>
                            <p className="text-[12px] text-slate-600 leading-5">{market.layers.overallMarket}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-indigo-200 shadow-md ring-1 ring-indigo-100 space-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500"></div>
                            <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">SAM</span>
                            <h4 className="font-bold text-slate-900 text-sm">بازار هدف</h4>
                            <p className="text-[12px] text-slate-600 leading-5">{market.layers.targetMarket}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm space-y-2">
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">SOM</span>
                            <h4 className="font-bold text-slate-900 text-sm">بازار قابل دسترس</h4>
                            <p className="text-[12px] text-slate-600 leading-5">{market.layers.reachableMarket}</p>
                        </div>
                    </div>
                </div>

                {/* Competitors */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 space-y-4 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-sm md:text-base font-semibold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-600" />
                            {market.competitors.title || "تحلیل رقبا"}
                        </h2>
                        <p className="text-[12px] md:text-[13px] text-slate-600 leading-6 max-w-3xl">
                             {market.competitors.description}
                        </p>
                    </div>
                    
                    <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0 pb-2">
                        <table className="min-w-[600px] w-full text-right border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 rounded-r-lg border-y border-r border-slate-200">نام رقیب</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 border-y border-slate-200">نوع</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 border-y border-slate-200">نقاط قوت</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 rounded-l-lg border-y border-l border-slate-200">نقاط ضعف</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px] text-slate-700">
                                {market.competitors.items.map((c, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4 border-b border-slate-100 font-bold text-slate-900 align-top">{c.name}</td>
                                        <td className="px-4 py-4 border-b border-slate-100 align-top">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                                {c.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 border-b border-slate-100 align-top">
                                            <ul className="space-y-1 list-disc pr-3 marker:text-emerald-500">
                                                {c.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </td>
                                        <td className="px-4 py-4 border-b border-slate-100 align-top">
                                            <ul className="space-y-1 list-disc pr-3 marker:text-rose-500">
                                                {c.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Opportunities & Risks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Opportunities */}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 md:p-6 space-y-3">
                        <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {market.opportunities.title}
                        </h3>
                        <ul className="space-y-2">
                            {market.opportunities.bullets.map((item, idx) => (
                                <li key={idx} className="flex gap-2 text-[12px] md:text-[13px] text-slate-700">
                                    <span className="text-emerald-500 font-bold mt-1">•</span>
                                    <span className="leading-6">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Risks */}
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5 md:p-6 space-y-3">
                        <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            {market.risks.title}
                        </h3>
                        <ul className="space-y-2">
                            {market.risks.bullets.map((item, idx) => (
                                <li key={idx} className="flex gap-2 text-[12px] md:text-[13px] text-slate-700">
                                    <span className="text-rose-500 font-bold mt-1">•</span>
                                    <span className="leading-6">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )}
      </div>
    </main>
  );
}
