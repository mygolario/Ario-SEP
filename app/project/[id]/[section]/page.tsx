import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import StrategyMap from '@/components/StrategyMap';
import ShareLinkButton from '@/components/ShareLinkButton';
import RegenerateButton from '@/components/RegenerateButton';
import { Button } from '@/components/ui/button';
import { Settings, ShieldCheck, Home } from 'lucide-react';
import { StartupPlan, DeepPlanData, BrandingKitData, LandingPagePlanData, MarketAnalysisData, PitchDeckData, FundingRoadmapData } from '@/lib/types';
import DeepPlanGenerator from '@/components/DeepPlanGenerator';
import DeepPlanRenderer from '@/components/DeepPlanRenderer';
import BrandingKitGenerator from '@/components/BrandingKitGenerator';
import BrandingKitRenderer from '@/components/BrandingKitRenderer';
import LandingPageGenerator from '@/components/LandingPageGenerator';
import LandingPageRenderer from '@/components/LandingPageRenderer';
import MarketAnalysisTab from '@/components/market/MarketAnalysisTab';
import PitchDeckTab from '@/components/pitch-deck/PitchDeckTab';
import FundingRoadmapTab from '@/components/funding/FundingRoadmapTab';
import ProjectSettings from '@/components/ProjectSettings';
import ExecutionCoachPanel from '@/components/ExecutionCoachPanel';

interface SectionPageProps {
  params: Promise<{
    id: string;
    section: string;
  }>;
}

export default async function ProjectSectionPage({ params }: SectionPageProps) {
  const { id, section } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
    include: {
      strategyMaps: {
        orderBy: {
            createdAt: 'desc'
        },
        take: 1
      },
      deepPlan: true,
      brandingKit: true,
      landingPagePlan: true,
      marketAnalysis: true,
      pitchDeck: true,
      fundingRoadmap: true,
    },
  });

  if (!project) {
    notFound();
  }

  if (project.userId !== user.id) {
    redirect('/dashboard'); 
  }

  // Common data preparation
  const hasStrategyMap = !!project.strategyMaps?.[0]?.data;
  const plan = hasStrategyMap ? (project.strategyMaps[0].data as unknown as StartupPlan) : null;
  const hasDeepPlan = !!project.deepPlan?.data;
  const deepPlan = hasDeepPlan ? (project.deepPlan?.data as unknown as DeepPlanData) : null;
  const hasBrandingKit = !!project.brandingKit?.data;
  const brandingKit = hasBrandingKit ? (project.brandingKit?.data as unknown as BrandingKitData) : null;
  const hasLandingPagePlan = !!project.landingPagePlan?.data;
  const landingPagePlan = hasLandingPagePlan ? (project.landingPagePlan?.data as unknown as LandingPagePlanData) : null;
  const hasMarketAnalysis = !!project.marketAnalysis?.data;
  const marketAnalysis = hasMarketAnalysis ? (project.marketAnalysis?.data as unknown as MarketAnalysisData) : null;
  const hasPitchDeck = !!project.pitchDeck?.data;
  const pitchDeck = hasPitchDeck ? (project.pitchDeck?.data as unknown as PitchDeckData) : null;
  const hasFundingRoadmap = !!project.fundingRoadmap?.data;
  const fundingRoadmap = hasFundingRoadmap ? (project.fundingRoadmap?.data as unknown as FundingRoadmapData) : null;

  // Header Actions Component for reusability in header
  const HeaderActions = () => (
      <div className='flex gap-2 items-center'>
        {user && project.userId === user.id && (
            <RegenerateButton projectId={project.id} />
        )}
        <ShareLinkButton publicId={project.publicId} />
        <a href={`/api/export-pdf/${project.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">دانلود PDF</Button>
        </a>
      </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return (
             <div className="space-y-6" dir="rtl">
                 <div className="flex items-center justify-between">
                     <div className="text-right">
                        <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
                        <p className="text-muted-foreground mt-1">نمای کلی پروژه</p>
                     </div>
                     <HeaderActions />
                 </div>
                 {/* Simple Overview Dashboard - reusing One-Page Summary for now */}
                 {plan ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                         <div className="col-span-full p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm text-right">
                             <h3 className="text-lg font-semibold mb-2">معرفی آسانسوری (Elevator Pitch)</h3>
                             <p className="text-slate-700 dark:text-slate-300">{plan.summary.elevatorPitch}</p>
                         </div>
                         <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm text-right">
                             <h3 className="text-lg font-semibold mb-2">مخاطب هدف</h3>
                             <p className="text-slate-700 dark:text-slate-300">{project.targetAudience}</p>
                         </div>
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm text-right">
                             <h3 className="text-lg font-semibold mb-2">هدف اصلی</h3>
                             <p className="text-slate-700 dark:text-slate-300">{plan.summary.coreGoal}</p>
                         </div>
                         {/* Quick Links to other sections could go here */}
                     </div>
                 ) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold">هیچ پلنی ساخته نشده است</h2>
                        <p className="text-muted-foreground mt-2">برای مشاهده نمای کلی، ابتدا یک پلن ایجاد کنید.</p>
                    </div>
                 )}
             </div>
        );
      case 'one-page':
        return (
            <div className="space-y-6" dir="rtl">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">پلن یک‌صفحه‌ای</h2>
                    <HeaderActions />
                </div>
                 {plan ? (
                    <StrategyMap plan={plan} />
                 ) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold">پلن یک‌صفحه‌ای یافت نشد</h2>
                        <p className="text-muted-foreground mt-2">از داشبورد برای ایجاد ایده جدید استفاده کنید.</p>
                    </div>
                 )}
            </div>
        );
      case 'deep-plan':
        return (
           <div className="space-y-6" dir="rtl">
               <h2 className="text-2xl font-bold text-right">استراتژی عمیق</h2>
                 {deepPlan ? (
                    <DeepPlanRenderer plan={deepPlan} />
                 ) : (
                    <DeepPlanGenerator projectId={project.id} />
                 )}
           </div>
        );
      case 'branding':
        return (
             <div className="space-y-6" dir="rtl">
                 <h2 className="text-2xl font-bold text-right">کیت برندسازی</h2>
                 {brandingKit ? (
                    <BrandingKitRenderer kit={brandingKit} />
                 ) : (
                    <BrandingKitGenerator projectId={project.id} />
                 )}
             </div>
        );
      case 'landing-page':
        return (
             <div className="space-y-6" dir="rtl">
                 <h2 className="text-2xl font-bold text-right">برنامه لندینگ پیج</h2>
                 {landingPagePlan ? (
                    <LandingPageRenderer plan={landingPagePlan} />
                 ) : (
                    <LandingPageGenerator projectId={project.id} />
                 )}
             </div>
        );
      case 'market-analysis':
        return (
             <MarketAnalysisTab projectId={project.id} marketAnalysis={marketAnalysis} />
        );
      case 'pitch-deck':
        return (
             <PitchDeckTab projectId={project.id} pitchDeck={pitchDeck} />
        );
      case 'funding':
        return (
             <FundingRoadmapTab projectId={project.id} fundingRoadmap={fundingRoadmap} />
        );
      case 'execution':
        return (
             <div className="space-y-6" dir="rtl">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">مربی اجرا (Execution Coach)</h2>
                 </div>
                 <p className="text-muted-foreground text-right">اقدامات مشخص برای پیشبرد ایده شما در این هفته.</p>
                 <div className="p-8 border rounded-lg bg-slate-50 dark:bg-slate-900">
                     <p className="mb-4 text-right">مربی اجرا با هوش مصنوعی لیست کارها و راهنمایی‌های لازم را ارائه می‌دهد.</p>
                     <ExecutionCoachPanel projectId={project.id} />
                 </div>
             </div>
        );
      case 'settings':
        return (
             <div className="space-y-6" dir="rtl">
                 <h2 className="text-2xl font-bold text-right">تنظیمات</h2>
                 <ProjectSettings project={project} />
             </div>
        );
      default:
        return (
            <div className="p-12 text-center" dir="rtl">
                <h2 className="text-xl font-semibold">بخش مورد نظر یافت نشد</h2>
                <Link href={`/project/${project.id}/overview`}><Button className="mt-4">بازگشت به نمای کلی</Button></Link>
            </div>
        );
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
        {renderSection()}
    </div>
  );
}
