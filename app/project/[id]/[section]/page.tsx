import { auth } from '@/lib/auth';
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
  const session = await auth();

  if (!session?.user?.id) {
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

  if (project.userId !== session.user.id) {
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
        {session?.user?.id && project.userId === session.user.id && (
            <RegenerateButton projectId={project.id} />
        )}
        <ShareLinkButton publicId={project.publicId} />
        <a href={`/api/export-pdf/${project.id}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Download PDF</Button>
        </a>
      </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'overview':
        return (
             <div className="space-y-6">
                 <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
                        <p className="text-muted-foreground mt-1">Project Overview</p>
                     </div>
                     <HeaderActions />
                 </div>
                 {/* Simple Overview Dashboard - reusing One-Page Summary for now */}
                 {plan ? (
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                         <div className="col-span-full p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
                             <h3 className="text-lg font-semibold mb-2">Elevator Pitch</h3>
                             <p className="text-slate-700 dark:text-slate-300">{plan.summary.elevatorPitch}</p>
                         </div>
                         <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
                             <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
                             <p className="text-slate-700 dark:text-slate-300">{project.targetAudience}</p>
                         </div>
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-lg border shadow-sm">
                             <h3 className="text-lg font-semibold mb-2">Core Goal</h3>
                             <p className="text-slate-700 dark:text-slate-300">{plan.summary.coreGoal}</p>
                         </div>
                         {/* Quick Links to other sections could go here */}
                     </div>
                 ) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold">No Plan Generated</h2>
                        <p className="text-muted-foreground mt-2">Generate a plan to see the overview.</p>
                    </div>
                 )}
             </div>
        );
      case 'one-page':
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">One-Page Plan</h2>
                    <HeaderActions />
                </div>
                 {plan ? (
                    <StrategyMap plan={plan} />
                 ) : (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg">
                        <h2 className="text-xl font-semibold">No One-Page Plan Found</h2>
                        <p className="text-muted-foreground mt-2">Use the dashboard to generate a new idea.</p>
                    </div>
                 )}
            </div>
        );
      case 'deep-plan':
        return (
           <div className="space-y-6">
               <h2 className="text-2xl font-bold">Deep Plan</h2>
                 {deepPlan ? (
                    <DeepPlanRenderer plan={deepPlan} />
                 ) : (
                    <DeepPlanGenerator projectId={project.id} />
                 )}
           </div>
        );
      case 'branding':
        return (
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Branding Kit</h2>
                 {brandingKit ? (
                    <BrandingKitRenderer kit={brandingKit} />
                 ) : (
                    <BrandingKitGenerator projectId={project.id} />
                 )}
             </div>
        );
      case 'landing-page':
        return (
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Landing Page Plan</h2>
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
             <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Execution Coach</h2>
                 </div>
                 <div className="p-8 border rounded-lg bg-slate-50 dark:bg-slate-900">
                     <p className="mb-4">The Execution Coach provides AI-powered task lists and guidance.</p>
                     <ExecutionCoachPanel projectId={project.id} />
                 </div>
             </div>
        );
      case 'settings':
        return (
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold">Settings</h2>
                 <ProjectSettings project={project} />
             </div>
        );
      default:
        return (
            <div className="p-12 text-center">
                <h2 className="text-xl font-semibold">Section Not Found</h2>
                <Link href={`/project/${project.id}/overview`}><Button className="mt-4">Go to Overview</Button></Link>
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
