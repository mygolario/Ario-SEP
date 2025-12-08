
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import GeneratePitchDeckButton from "@/components/projects/GeneratePitchDeckButton";
import { PitchDeckData } from "@/lib/types";
import { Presentation, Target, Lightbulb, Monitor, PlayCircle } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PitchDeckPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  const pitchDeck = await prisma.pitchDeck.findUnique({
    where: { ideaIntakeId: id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  const deck = pitchDeck?.data as unknown as PitchDeckData | null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header */}
        <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            طرح ارائه برای سرمایه‌گذار (Pitch Deck)
            </h1>
            <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، اسکلت کامل اسلایدهای ارائه برای سرمایه‌گذار را می‌بینی؛ از مشکل و راه‌حل تا بازار، تیم و درخواست سرمایه.
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

        {!deck ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
                <div className="bg-indigo-50 p-4 rounded-full">
                <Presentation className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز برای این ایده طرح ارائه ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی یک اسکلت کامل Pitch Deck برای همین ایده بسازی و بعداً آن را به اسلاید تبدیل کنی.</p>
                </div>
                <GeneratePitchDeckButton projectId={id} />
            </div>
        ) : (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm md:text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-indigo-600" />
                        اسلایدهای پیشنهادی
                    </h2>
                    <p className="text-[11px] md:text-xs text-slate-500 hidden md:block">
                        این ساختار را می‌توانی مستقیماً به اسلاید تبدیل کنی.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {deck.slides
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((slide) => (
                            <div
                            key={slide.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm flex flex-col gap-3 hover:border-indigo-200 transition-colors relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-1 h-full bg-slate-100"></div>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                         <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 text-[12px] font-bold w-7 h-7 border border-slate-200">
                                        {slide.order}
                                        </span>
                                        <h3 className="text-sm md:text-[15px] font-bold text-slate-900">
                                        {slide.title}
                                        </h3>
                                    </div>
                                    {/* Icon placeholder based on ID could go here */}
                                </div>

                                {slide.subtitle && (
                                    <p className="text-[11px] md:text-[12px] text-slate-500 font-medium leading-5">
                                    {slide.subtitle}
                                    </p>
                                )}

                                {slide.body && (
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                         <p className="text-[12px] text-slate-700 leading-6 whitespace-pre-line">
                                            {slide.body}
                                        </p>
                                    </div>
                                )}

                                {slide.bullets && slide.bullets.length > 0 && (
                                    <ul className="mt-1 space-y-1.5 text-[11px] md:text-[12px] text-slate-700 list-disc pr-4 marker:text-indigo-400">
                                    {slide.bullets.map((b, idx) => (
                                        <li key={idx}>{b}</li>
                                    ))}
                                    </ul>
                                )}

                                {slide.note && (
                                    <div className="mt-auto pt-2">
                                        <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 flex gap-2 items-start">
                                            <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                                            <p className="text-[10px] md:text-[11px] text-amber-800 leading-5">
                                                <span className="font-bold">نکته ارائه:</span> {slide.note}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </main>
  );
}

