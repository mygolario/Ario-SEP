'use client';

import { LandingPagePlanData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LandingPageRendererProps {
  plan: LandingPagePlanData;
}

export default function LandingPageRenderer({ plan }: LandingPageRendererProps) {
  return (
    <div className="space-y-8">
      
      {/* Hero Section */}
      <section className="bg-slate-900 text-white rounded-xl p-8 md:p-12 text-center space-y-6 shadow-xl">
           <Badge variant="secondary" className="mb-4">Hero Section</Badge>
           <h2 className="text-3xl md:text-5xl font-extrabold max-w-4xl mx-auto leading-tight">{plan.hero.headline}</h2>
           <p className="text-xl text-slate-300 max-w-2xl mx-auto">{plan.hero.subheadline}</p>
           
           <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
               <div className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                   {plan.hero.primaryCTA}
               </div>
               {plan.hero.secondaryCTA && (
                   <div className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors">
                       {plan.hero.secondaryCTA}
                   </div>
               )}
           </div>

           <div className="pt-8 grid md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
               {plan.hero.keyBenefits.map((benefit, i) => (
                   <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-sm md:text-base">
                       ✓ {benefit}
                   </div>
               ))}
           </div>
      </section>

      {/* Recommended Content Sections */}
      <section>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
             Page Sections
             <Badge variant="outline" className="text-sm font-normal">in order</Badge>
          </h3>
          <div className="space-y-6">
              {plan.sections.map((section, i) => (
                  <Card key={i} className="relative overflow-hidden border-l-4 border-l-primary/50">
                      <div className="absolute top-4 right-4 text-xs font-mono text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">
                          {section.type.replace('-', ' ')}
                      </div>
                      <CardHeader>
                          <CardTitle className="pr-20 text-xl">{section.title}</CardTitle>
                          {section.subtitle && (
                              <p className="text-muted-foreground">{section.subtitle}</p>
                          )}
                      </CardHeader>
                      <CardContent>
                          {section.body && (
                              <p className="mb-4 text-slate-700 dark:text-slate-300 whitespace-pre-line">{section.body}</p>
                          )}
                          {section.bulletPoints && section.bulletPoints.length > 0 && (
                              <ul className="grid md:grid-cols-2 gap-2 mt-2">
                                  {section.bulletPoints.map((point, idx) => (
                                      <li key={idx} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                                          <span className="text-primary">•</span> 
                                          {point}
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
           {/* Layout Notes */}
          <section>
               <h3 className="text-2xl font-bold mb-4">Design & Layout Notes</h3>
               <Card>
                   <CardContent className="pt-6 space-y-4">
                       <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">General Style</h4>
                           <p>{plan.layoutNotes.generalStyle}</p>
                       </div>
                       <Separator />
                       <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Structure Strategy</h4>
                           <p>{plan.layoutNotes.suggestedStructure}</p>
                       </div>
                       <Separator />
                       <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Above-the-Fold Focus</h4>
                           <p>{plan.layoutNotes.aboveTheFoldFocus}</p>
                       </div>
                   </CardContent>
               </Card>
          </section>

          {/* SEO */}
          <section>
               <h3 className="text-2xl font-bold mb-4">SEO Strategy</h3>
               <Card>
                   <CardContent className="pt-6 space-y-4">
                       <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Target Keyword</h4>
                           <div className="inline-block px-3 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 rounded-full font-medium text-sm">
                               {plan.seo.targetKeyword}
                           </div>
                       </div>
                       <Separator />
                       <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Meta Title</h4>
                           <p className="font-mono text-sm bg-muted p-2 rounded">{plan.seo.metaTitle}</p>
                       </div>
                       <div>
                           <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Meta Description</h4>
                           <p className="text-sm">{plan.seo.metaDescription}</p>
                       </div>
                   </CardContent>
               </Card>
          </section>
      </div>

    </div>
  );
}
