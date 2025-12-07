import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import StrategyMap from '@/components/StrategyMap';
import ShareLinkButton from '@/components/ShareLinkButton';
import RegenerateButton from '@/components/RegenerateButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutTemplate, Layers, Settings, Palette, Layout, ShieldCheck, Presentation } from 'lucide-react';
import { StartupPlan, DeepPlanData, BrandingKitData, LandingPagePlanData, MarketAnalysisData, PitchDeckData } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeepPlanGenerator from '@/components/DeepPlanGenerator';
import DeepPlanRenderer from '@/components/DeepPlanRenderer';
import BrandingKitGenerator from '@/components/BrandingKitGenerator';
import BrandingKitRenderer from '@/components/BrandingKitRenderer';
import LandingPageGenerator from '@/components/LandingPageGenerator';
import LandingPageRenderer from '@/components/LandingPageRenderer';
import MarketAnalysisTab from '@/components/market/MarketAnalysisTab';
import PitchDeckTab from '@/components/pitch-deck/PitchDeckTab';
import ProjectSettings from '@/components/ProjectSettings';
import ExecutionCoachPanel from '@/components/ExecutionCoachPanel';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
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
    },
  });

  if (!project) {
    notFound();
  }

  if (project.userId !== session.user.id) {
    redirect('/dashboard'); 
  }

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

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {project.title}
                </h1>
                <p className="text-sm text-slate-500">
                  Created {project.createdAt.toLocaleDateString()}
                </p>
              </div>
           </div>
           <div>
            <div className='flex gap-2 items-center'>
            {project.userId === session.user.id && (
                <RegenerateButton projectId={project.id} />
            )}
            <ShareLinkButton publicId={project.publicId} />
           <a href={`/api/export-pdf/${project.id}`} target="_blank" rel="noopener noreferrer">
             <Button variant="outline">
               Download PDF
             </Button>
           </a>
            <ExecutionCoachPanel projectId={project.id} />
            </div>
           </div>
        </header>

        <Tabs defaultValue="one-page" className="w-full">
          <TabsList className="grid w-full grid-cols-7 max-w-[950px] mb-8 overflow-x-auto">
            <TabsTrigger value="one-page" className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              One-Page
            </TabsTrigger>
            <TabsTrigger value="deep-plan" className="flex items-center gap-2">
               <Layers className="h-4 w-4" />
               Deep Plan
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
               <Palette className="h-4 w-4" />
               Branding
            </TabsTrigger>
            <TabsTrigger value="market-analysis" className="flex items-center gap-2">
               <ShieldCheck className="h-4 w-4" />
               Market
            </TabsTrigger>
            <TabsTrigger value="pitch-deck" className="flex items-center gap-2">
               <Presentation className="h-4 w-4" />
               Pitch Deck
            </TabsTrigger>
            <TabsTrigger value="landing-page" className="flex items-center gap-2">
               <Layout className="h-4 w-4" />
               Landing Page
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
               <Settings className="h-4 w-4" />
               Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="one-page" className="mt-0">
             {plan ? (
                <StrategyMap plan={plan} />
             ) : (
                <div className="p-12 text-center border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold">No One-Page Plan Found</h2>
                    <p className="text-muted-foreground mt-2">Use the dashboard to generate a new idea.</p>
                </div>
             )}
          </TabsContent>
          
          <TabsContent value="deep-plan" className="mt-0">
             {deepPlan ? (
                <DeepPlanRenderer plan={deepPlan} />
             ) : (
                <DeepPlanGenerator projectId={project.id} />
             )}
          </TabsContent>

          <TabsContent value="branding" className="mt-0">
             {brandingKit ? (
                <BrandingKitRenderer kit={brandingKit} />
             ) : (
                <BrandingKitGenerator projectId={project.id} />
             )}
          </TabsContent>

          <TabsContent value="market-analysis" className="mt-0">
             <MarketAnalysisTab projectId={project.id} marketAnalysis={marketAnalysis} />
          </TabsContent>

          <TabsContent value="pitch-deck" className="mt-0">
             <PitchDeckTab projectId={project.id} pitchDeck={pitchDeck} />
          </TabsContent>

          <TabsContent value="landing-page" className="mt-0">
             {landingPagePlan ? (
                <LandingPageRenderer plan={landingPagePlan} />
             ) : (
                <LandingPageGenerator projectId={project.id} />
             )}
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
             <ProjectSettings project={project} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
