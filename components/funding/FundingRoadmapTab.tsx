'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FundingRoadmapData, FundingStrategy } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw, HandCoins, CheckCircle2, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  projectId: string;
  fundingRoadmap?: FundingRoadmapData | null;
}

export default function FundingRoadmapTab({ projectId, fundingRoadmap }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/funding-roadmap`, {
        method: 'POST',
      });

      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || 'Failed');
      }

      toast({
        title: "Funding Roadmap Generated",
        description: "Your comprehensive funding strategy is ready.",
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

  if (!fundingRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
            <HandCoins className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <div className="max-w-md space-y-2">
            <h3 className="text-xl font-semibold">Generate Funding Roadmap</h3>
            <p className="text-muted-foreground">
                Get a strategic plan for raising capital, including timing, ask amount, and a tactical 90-day checklist.
            </p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} size="lg" className="bg-green-600 hover:bg-green-700">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Building Strategy...
            </>
          ) : (
            <>
              <HandCoins className="mr-2 h-4 w-4" />
              Generate Roadmap
            </>
          )}
        </Button>
      </div>
    );
  }

  const {
      shouldRaiseNow,
      recommendedStrategy,
      reasoning,
      prerequisites,
      plan30Days,
      plan90Days,
      recommendedAsk,
      risks
  } = fundingRoadmap;

  const strategyColors: Record<FundingStrategy, "default" | "secondary" | "destructive" | "outline"> = {
      bootstrapping: "outline",
      angel: "default",
      accelerator: "secondary",
      vc: "default",
      grant: "outline",
      not_recommended_yet: "destructive"
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-bold">Funding Roadmap</h2>
            <p className="text-muted-foreground">Strategic plan to secure capital for your startup.</p>
         </div>
         <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Regenerate Strategy
         </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
          {/* Strategy & Reasoning */}
          <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                      Should You Raise Now?
                      <Badge variant={shouldRaiseNow ? "default" : "destructive"}>
                          {shouldRaiseNow ? "YES" : "NO"}
                      </Badge>
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Reasoning</div>
                      <p className="text-sm">{reasoning}</p>
                  </div>
                  <Separator className="bg-green-200 dark:bg-green-800/50" />
                  <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Recommended Path</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={strategyColors[recommendedStrategy]}>
                            {recommendedStrategy.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      </div>
                  </div>
              </CardContent>
          </Card>

           {/* The Ask */}
           <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <HandCoins className="h-5 w-5 text-green-600" />
                      The Ask Structure
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Target Amount</div>
                          <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{recommendedAsk.amountRange}</div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                          <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Runway</div>
                          <div className="text-xl font-bold mt-1">{recommendedAsk.runwayMonths} Months</div>
                      </div>
                  </div>
                  <div>
                      <div className="text-sm font-medium mb-3">Use of Funds</div>
                      <div className="space-y-2">
                          {recommendedAsk.useOfFunds.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                  <span>{item.label}</span>
                                  <span className="font-mono text-muted-foreground">{item.percent}%</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Prerequisites */}
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Pre-Fundraising Checklist
              </CardTitle>
              <CardDescription>{prerequisites.description}</CardDescription>
          </CardHeader>
          <CardContent>
              <ul className="grid md:grid-cols-2 gap-2">
                  {prerequisites.checklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                          <span>{item}</span>
                      </li>
                  ))}
              </ul>
          </CardContent>
      </Card>

      {/* Action Plans */}
      <div className="grid md:grid-cols-2 gap-6">
          <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="h-4 w-4" />
                      30-Day Plan
                  </CardTitle>
                  <CardDescription className="font-medium text-primary">
                      Focus: {plan30Days.focus}
                  </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                  <ul className="space-y-2">
                      {plan30Days.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="font-bold text-slate-300 dark:text-slate-700">{i+1}.</span>
                              <span>{task}</span>
                          </li>
                      ))}
                  </ul>
              </CardContent>
          </Card>

          <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="h-4 w-4" />
                      90-Day Plan
                  </CardTitle>
                  <CardDescription className="font-medium text-primary">
                      Focus: {plan90Days.focus}
                  </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                   <ul className="space-y-2">
                      {plan90Days.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="font-bold text-slate-300 dark:text-slate-700">{i+1}.</span>
                              <span>{task}</span>
                          </li>
                      ))}
                  </ul>
              </CardContent>
          </Card>
      </div>

      {/* Risks */}
      <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Risks & Blockers
              </CardTitle>
          </CardHeader>
          <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {risks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                  ))}
              </ul>
          </CardContent>
      </Card>
    </div>
  );
}
