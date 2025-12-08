
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import GenerateBrandingKitButton from "@/components/projects/GenerateBrandingKitButton";
import { BrandingKitData } from "@/lib/types";
import { Palette, Layers, MessageSquare, Heart, Eye, Target, Zap, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BrandingKitPage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const project = await prisma.ideaIntake.findUnique({
    where: { id },
  });

  const brandingKit = await prisma.brandingKit.findFirst({
    where: { ideaIntakeId: id },
  });

  if (!project || (project.userId !== user.id && user.role !== "ADMIN")) {
    redirect("/dashboard/projects");
  }

  // Validate wrapper for legacy data safely
  const rawKit = brandingKit?.data as any;
  const isValidKit = rawKit && 
                     rawKit.nameAndSlogan && 
                     rawKit.personality &&
                     rawKit.colors;

  const kit = isValidKit ? (rawKit as BrandingKitData) : null;

  return (
    <main className="min-h-screen bg-slate-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8 text-right">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            بسته برند برای این ایده
          </h1>
          <p className="text-sm md:text-[13px] text-slate-600 leading-6">
            در این بخش، هویت بصری، کلامی و شخصیت برند شما ساخته می‌شود؛ از نام و شعار تا پالت رنگ.
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

        {!kit ? (
           <div className="border border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 bg-white/50">
             <div className="bg-indigo-50 p-4 rounded-full">
                <Palette className="h-8 w-8 text-indigo-600" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">هنوز برای این ایده بسته برند ساخته نشده</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">با یک کلیک می‌توانی یک هویت برند اولیه شامل نام، شعار، رنگ‌ها و لحن گفتار بسازی.</p>
             </div>
             <GenerateBrandingKitButton projectId={id} />
           </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. Name & Slogan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-start gap-4">
                   <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <Target className="h-5 w-5 text-indigo-600" />
                   </div>
                   <div className="space-y-2 flex-1">
                      <h2 className="text-base font-bold text-slate-900">
                        {kit.nameAndSlogan.title}
                      </h2>
                      <p className="text-[13px] text-slate-700 leading-7 text-justify pl-4">
                        {kit.nameAndSlogan.description}
                      </p>
                      {kit.nameAndSlogan.options && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                           {kit.nameAndSlogan.options.map((opt, i) => (
                              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                                 <span className="text-sm font-semibold text-indigo-700">{opt}</span>
                              </div>
                           ))}
                        </div>
                      )}
                   </div>
                </div>
            </div>

            {/* 2. Personality & Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-rose-500" />
                        {kit.personality.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {kit.personality.description}
                    </p>
                    {kit.personality.bullets && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {kit.personality.bullets.map((item, i) => (
                               <span key={i} className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px]">{item}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        {kit.toneOfVoice.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {kit.toneOfVoice.description}
                    </p>
                    {kit.toneOfVoice.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {kit.toneOfVoice.bullets.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>
            </div>

            {/* 3. Visual Direction & Colors */}
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-purple-600" />
                        {kit.visualDirection.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {kit.visualDirection.description}
                    </p>
                    {kit.visualDirection.keywords && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {kit.visualDirection.keywords.map((kw, i) => (
                                <span key={i} className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[11px] text-purple-800">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Colors Grid */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm space-y-4">
                     <div className="space-y-1">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Palette className="h-5 w-5 text-slate-700" />
                            {kit.colors.title}
                        </h2>
                        <p className="text-[13px] text-slate-600">
                            {kit.colors.description}
                        </p>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {kit.colors.palette.map((color, idx) => (
                            <div key={idx} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                                <div className="h-20 w-full" style={{ backgroundColor: color.hex }} />
                                <div className="p-3 flex flex-col gap-1">
                                    <span className="text-[12px] font-bold text-slate-900">{color.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono" dir="ltr">{color.hex}</span>
                                    <p className="text-[10px] text-slate-600 leading-4 mt-1 border-t pt-2 border-slate-100">
                                        {color.usage}
                                    </p>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* 4. Brand Promises & Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        {kit.brandPromises.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {kit.brandPromises.description}
                    </p>
                     {kit.brandPromises.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {kit.brandPromises.bullets.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-orange-500" />
                        {kit.usageExamples.title}
                    </h2>
                    <p className="text-[13px] text-slate-700 leading-7 text-justify">
                        {kit.usageExamples.description}
                    </p>
                    {kit.usageExamples.bullets && (
                        <ul className="mt-2 space-y-1.5 text-[12px] text-slate-600 list-disc pr-4">
                            {kit.usageExamples.bullets.map((item, i) => <li key={i}>{item}</li>)}
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

