'use client';

import { DeepPlanData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DeepPlanRendererProps {
  plan: DeepPlanData;
}

export default function DeepPlanRenderer({ plan }: DeepPlanRendererProps) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{plan.overview.marketSummary}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Main Problem</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{plan.overview.mainProblem}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Main Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{plan.overview.mainOpportunity}</p>
          </CardContent>
        </Card>
      </section>

      {/* Customer Segments */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Customer Segments</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {plan.customerSegments.map((segment, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{segment.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{segment.description}</p>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Pains</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {segment.pains.map((pain, i) => <li key={i}>{pain}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Gains</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {segment.gains.map((gain, i) => <li key={i}>{gain}</li>)}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Personas */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Personas</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plan.personas.map((persona, idx) => (
                <Card key={idx}>
                    <CardHeader>
                        <CardTitle>{persona.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{persona.role}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h4 className="font-semibold text-sm mb-1">Goals</h4>
                            <ul className="list-disc list-inside text-xs text-muted-foreground">
                                {persona.goals.map((g, i) => <li key={i}>{g}</li>)}
                            </ul>
                         </div>
                         <div>
                            <h4 className="font-semibold text-sm mb-1">Frustrations</h4>
                            <ul className="list-disc list-inside text-xs text-muted-foreground">
                                {persona.frustrations.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                         </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* Competitors */}
      <section>
        <h3 className="text-2xl font-bold mb-4">Competitors</h3>
        <div className="grid gap-6 md:grid-cols-2">
            {plan.competitors.map((comp, idx) => (
                <Card key={idx}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <CardTitle>{comp.name}</CardTitle>
                             <Badge variant="outline">{comp.type}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-sm text-green-600 mb-1">Strengths</h4>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {comp.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-red-600 mb-1">Weaknesses</h4>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {comp.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>
                        <Separator />
                        <div>
                             <h4 className="font-semibold text-sm mb-1">Differentiation</h4>
                             <p className="text-sm text-muted-foreground">{comp.differentiation}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
      
      {/* Extended Roadmap */}
       <section>
            <h3 className="text-2xl font-bold mb-4">Extended Roadmap</h3>
            <div className="space-y-4">
                {plan.extendedRoadmap.map((phase, idx) => (
                    <Card key={idx}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">{phase.phase}</CardTitle>
                                <Badge>{phase.timeFrame}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1">
                                {phase.items.map((item, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">{item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
       </section>

      {/* Monetization & GTM */}
      <div className="grid gap-8 md:grid-cols-2">
          <section>
              <h3 className="text-2xl font-bold mb-4">Monetization</h3>
              <Card className="h-full">
                  <CardHeader>
                      <CardTitle className="text-lg">Strategy: {plan.monetization.pricingStrategy}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div>
                          <h4 className="font-semibold text-sm mb-2">Revenue Streams</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {plan.monetization.revenueStreams.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-semibold text-sm mb-2">Cost Drivers</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {plan.monetization.costDrivers.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                      </div>
                  </CardContent>
              </Card>
          </section>

          <section>
              <h3 className="text-2xl font-bold mb-4">Go-To-Market</h3>
               <Card className="h-full">
                  <CardContent className="pt-6 space-y-6">
                      <div>
                          <h4 className="font-semibold text-sm mb-2">Marketing Channels</h4>
                          <div className="flex flex-wrap gap-2">
                              {plan.goToMarket.channels.map((c, i) => <Badge key={i} variant="secondary">{c}</Badge>)}
                          </div>
                      </div>
                       <div>
                          <h4 className="font-semibold text-sm mb-2">Key Actions</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {plan.goToMarket.keyActions.map((a, i) => <li key={i}>{a}</li>)}
                          </ul>
                      </div>
                      <div>
                           <h4 className="font-semibold text-sm mb-2">First 100 Users</h4>
                           <p className="text-sm text-muted-foreground italic">
                               &quot;{plan.goToMarket.first100UsersStrategy}&quot;
                           </p>
                      </div>
                  </CardContent>
               </Card>
          </section>
      </div>

       {/* Risks */}
       <section>
            <h3 className="text-2xl font-bold mb-4">Risks & Mitigation</h3>
            <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 font-semibold border-b bg-muted/50 text-sm">
                    <div className="col-span-4">Risk</div>
                    <div className="col-span-3">Impact</div>
                    <div className="col-span-5">Mitigation</div>
                </div>
                {plan.risks.map((risk, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 p-4 text-sm border-b last:border-0 items-start">
                         <div className="col-span-4 font-medium">{risk.risk}</div>
                         <div className="col-span-3 text-muted-foreground">{risk.impact}</div>
                         <div className="col-span-5 text-green-700 dark:text-green-400">{risk.mitigation}</div>
                    </div>
                ))}
            </div>
       </section>

    </div>
  );
}
