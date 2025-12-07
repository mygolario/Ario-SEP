'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MarketAnalysisData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw, TrendingUp, Users, Target, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  projectId: string;
  marketAnalysis?: MarketAnalysisData | null;
}

export default function MarketAnalysisTab({ projectId, marketAnalysis }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/market-analysis`, {
        method: 'POST',
      });

      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || 'Failed');
      }

      toast({
        title: "Analysis Complete",
        description: "Market overview and competitive landscape generated.",
      });
      
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!marketAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <TrendingUp className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="max-w-md space-y-2">
            <h3 className="text-xl font-semibold">No Market Analysis Yet</h3>
            <p className="text-muted-foreground">
                Generate a comprehensive market overview, competitor breakdown, and positioning strategy using AI.
            </p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Market...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Generate Analysis
            </>
          )}
        </Button>
      </div>
    );
  }

  const { marketOverview, idealCustomerProfile, competitors, positioningGaps, recommendedPositioning } = marketAnalysis;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-bold">Market & Competitors</h2>
            <p className="text-muted-foreground">Strategic analysis of your landscape and positioning.</p>
         </div>
         <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Refresh Analysis
         </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Market Overview */}
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <CardTitle>Market Overview</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Target Segment</div>
                    <div className="font-semibold text-lg">{marketOverview.segment}</div>
                </div>
                <div>
                     <div className="text-sm font-medium text-muted-foreground mb-1">Market Size & Vibe</div>
                     <p>{marketOverview.sizeDescription}</p>
                </div>
                <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Key Trends</div>
                    <ul className="space-y-2">
                        {marketOverview.trends.map((trend, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                {trend}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>

        {/* ICP */}
        <Card>
            <CardHeader className="pb-3">
                 <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <CardTitle>Ideal Customer Profile</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="italic text-muted-foreground border-l-4 border-purple-200 dark:border-purple-800 pl-4 py-1">
                    "{idealCustomerProfile.description}"
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Pain Points</div>
                        <ul className="space-y-1 text-sm">
                            {idealCustomerProfile.mainPainPoints.map((pt, i) => (
                                <li key={i} className="flex gap-2">
                                     <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                                     {pt}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                         <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Goals</div>
                         <ul className="space-y-1 text-sm">
                            {idealCustomerProfile.mainGoals.map((g, i) => (
                                <li key={i} className="flex gap-2">
                                     <Target className="h-4 w-4 text-green-400 shrink-0" />
                                     {g}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Competitors */}
      <div className="space-y-4">
         <h3 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-slate-500" />
            Competitive Landscape
         </h3>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitors.map((comp, i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-lg">{comp.name}</CardTitle>
                            <Badge variant={
                                comp.type.toLowerCase().includes('direct') ? 'destructive' : 'secondary'
                            }>
                                {comp.type}
                            </Badge>
                        </div>
                        <CardDescription className="line-clamp-3">{comp.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grow space-y-4 text-sm">
                        {comp.pricingSummary && (
                             <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-medium">
                                💰 {comp.pricingSummary}
                             </div>
                        )}
                        <div>
                             <div className="font-semibold text-green-600 mb-1">Strengths</div>
                             <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                {comp.strengths.slice(0, 3).map((s, idx) => <li key={idx}>{s}</li>)}
                             </ul>
                        </div>
                        <div>
                             <div className="font-semibold text-red-500 mb-1">Weaknesses</div>
                             <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                {comp.weaknesses.slice(0, 3).map((w, idx) => <li key={idx}>{w}</li>)}
                             </ul>
                        </div>
                    </CardContent>
                </Card>
            ))}
         </div>
      </div>

      {/* Positioning */}
      <Card className="border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/10">
           <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                    <Target className="h-6 w-6" />
                    Recommended Positioning
                </CardTitle>
                <CardDescription>
                    How to win in this market.
                </CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
                <div>
                     <div className="text-lg font-bold">"{recommendedPositioning.oneLiner}"</div>
                </div>
                <div>
                    <p className="text-muted-foreground leading-relaxed">
                        {recommendedPositioning.narrative}
                    </p>
                </div>
                
                <Separator  className="bg-indigo-200 dark:bg-indigo-800"/>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                         <h4 className="font-semibold mb-3">Key Differentiators</h4>
                         <ul className="space-y-2">
                             {recommendedPositioning.keyDifferentiators.map((diff, i) => (
                                 <li key={i} className="flex items-center gap-2">
                                     <Badge className="bg-indigo-600 hover:bg-indigo-600 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">{i+1}</Badge>
                                     <span className="text-sm font-medium">{diff}</span>
                                 </li>
                             ))}
                         </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Gap Opportunities</h4>
                         <ul className="space-y-3">
                             {positioningGaps.map((gap, i) => (
                                 <li key={i} className="text-sm p-3 bg-background rounded-lg border shadow-sm">
                                     <div className="font-medium text-red-500 mb-1">Competitor Miss: {gap.gapDescription}</div>
                                     <div className="text-indigo-600 font-medium">Opportunity: {gap.opportunity}</div>
                                 </li>
                             ))}
                         </ul>
                    </div>
                </div>
           </CardContent>
      </Card>
    </div>
  );
}
