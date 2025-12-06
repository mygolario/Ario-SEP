'use client';

import { BrandingKitData } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BrandingKitRendererProps {
  kit: BrandingKitData;
}

export default function BrandingKitRenderer({ kit }: BrandingKitRendererProps) {
  return (
    <div className="space-y-8">
      {/* Brand Essence */}
      <section>
          <div className="bg-linear-to-r from-pink-500 to-rose-500 rounded-lg p-8 text-white mb-6">
              <h3 className="text-3xl font-bold mb-2">{kit.messaging.tagline}</h3>
              <p className="opacity-90">{kit.messaging.elevatorPitch}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Core Idea</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{kit.brandEssence.coreIdea}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{kit.brandEssence.personality}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tone of Voice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{kit.brandEssence.toneOfVoice}</p>
              </CardContent>
            </Card>
          </div>
      </section>

      {/* Visual Direction */}
      <section>
          <h3 className="text-2xl font-bold mb-4">Visual Direction</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Color Palette</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kit.visualDirection.colorPalette.map((color, i) => (
                    <div key={i} className="space-y-2">
                        <div 
                            className="h-24 w-full rounded-md shadow-sm border" 
                            style={{ backgroundColor: color.hex }}
                        />
                        <div>
                            <p className="font-bold text-sm">{color.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">{color.hex}</p>
                            <p className="text-xs text-muted-foreground mt-1">{color.usage}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div>
             <h4 className="text-lg font-semibold mb-3">Typography</h4>
             <div className="grid gap-4 md:grid-cols-2">
                 {kit.visualDirection.typography.map((type, i) => (
                     <Card key={i}>
                         <CardHeader className="pb-2">
                             <CardTitle className="text-base">{type.role}</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <p className="text-2xl font-bold mb-1">{type.suggestion}</p>
                             <p className="text-sm text-muted-foreground">{type.styleNote}</p>
                         </CardContent>
                     </Card>
                 ))}
             </div>
          </div>
      </section>

      {/* Messaging */}
      <section>
         <h3 className="text-2xl font-bold mb-4">Messaging Strategy</h3>
         <Card>
             <CardContent className="pt-6 space-y-6">
                 <div>
                     <h4 className="font-semibold text-sm mb-1">Value Proposition</h4>
                     <p className="text-muted-foreground">{kit.messaging.valueProposition}</p>
                 </div>
                 <Separator />
                 <div>
                     <h4 className="font-semibold text-sm mb-1">Short Description</h4>
                     <p className="text-muted-foreground">{kit.messaging.shortDescription}</p>
                 </div>
             </CardContent>
         </Card>
      </section>

      {/* Hero Section */}
      <section>
         <h3 className="text-2xl font-bold mb-4">Hero Section Mockup</h3>
         <div className="border rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
             <div className="p-12 text-center max-w-2xl mx-auto">
                 <h1 className="text-4xl font-extrabold mb-4">{kit.heroSection.headline}</h1>
                 <p className="text-xl text-muted-foreground mb-8">{kit.heroSection.subheadline}</p>
                 <div className="flex justify-center gap-4">
                     <div className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold">
                         {kit.heroSection.primaryCTA}
                     </div>
                     <div className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-semibold">
                         {kit.heroSection.secondaryCTA}
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* Do / Don't */}
      <section>
           <h3 className="text-2xl font-bold mb-4">Brand Guidelines</h3>
           <div className="grid gap-6 md:grid-cols-2">
               <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                   <CardHeader>
                       <CardTitle className="text-green-700 dark:text-green-400">Do</CardTitle>
                   </CardHeader>
                   <CardContent>
                       <ul className="list-disc list-inside space-y-2 text-sm">
                           {kit.brandDoDont.do.map((item, i) => <li key={i}>{item}</li>)}
                       </ul>
                   </CardContent>
               </Card>
               <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                   <CardHeader>
                       <CardTitle className="text-red-700 dark:text-red-400">Don&apos;t</CardTitle>
                   </CardHeader>
                   <CardContent>
                       <ul className="list-disc list-inside space-y-2 text-sm">
                           {kit.brandDoDont.dont.map((item, i) => <li key={i}>{item}</li>)}
                       </ul>
                   </CardContent>
               </Card>
           </div>
      </section>
    </div>
  );
}
