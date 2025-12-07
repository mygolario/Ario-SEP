'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PitchDeckData, PitchDeckSlide } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, RefreshCcw, Presentation, Mic2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  projectId: string;
  pitchDeck?: PitchDeckData | null;
}

export default function PitchDeckTab({ projectId, pitchDeck }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/pitch-deck`, {
        method: 'POST',
      });

      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || 'Failed');
      }

      toast({
        title: "Pitch Deck Generated",
        description: "Your investor-ready slide outline is ready.",
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

  if (!pitchDeck) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <Presentation className="h-10 w-10 text-orange-600 dark:text-orange-400" />
        </div>
        <div className="max-w-md space-y-2">
            <h3 className="text-xl font-semibold">Generate Your Pitch Deck</h3>
            <p className="text-muted-foreground">
                Get a structured, investor-ready slide outline based on your complete project data.
            </p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} size="lg" className="bg-orange-600 hover:bg-orange-700">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Slides...
            </>
          ) : (
            <>
              <Presentation className="mr-2 h-4 w-4" />
              Generate Pitch Deck
            </>
          )}
        </Button>
      </div>
    );
  }

  const { titleSlide, slides, overallNarrative, investorFitNote } = pitchDeck;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-bold">Pitch Deck</h2>
            <p className="text-muted-foreground">Structure and content for your investor presentation.</p>
         </div>
         <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Regenerate Deck
         </Button>
      </div>

      {/* Narrative & Fit */}
      <Card className="bg-slate-50 dark:bg-slate-900/50 border-orange-200 dark:border-orange-900/50">
        <CardContent className="pt-6 space-y-4">
            <div>
                <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-1">The Narrative</h3>
                <p className="text-sm text-muted-foreground">{overallNarrative}</p>
            </div>
            {investorFitNote && (
                 <div>
                    <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-1">Investor Fit</h3>
                    <p className="text-sm text-muted-foreground">{investorFitNote}</p>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Title Slide */}
      <Card className="border-2 border-orange-500/20">
        <CardHeader className="text-center py-12 bg-orange-50 dark:bg-orange-950/20">
            <div className="font-bold text-3xl mb-2">{titleSlide.startupName}</div>
            <div className="text-xl text-muted-foreground mb-4">{titleSlide.tagline}</div>
            <div className="text-sm font-medium bg-white dark:bg-slate-900 px-4 py-2 rounded-full inline-block mx-auto shadow-sm">
                "{titleSlide.oneLiner}"
            </div>
        </CardHeader>
      </Card>

      {/* Slides using CSS Grid for masonry-like feel or just simple grid */}
      <div className="space-y-6">
          {slides.map((slide, index) => (
              <SlideCard key={slide.id} slide={slide} index={index} />
          ))}
      </div>
    </div>
  );
}

function SlideCard({ slide, index }: { slide: PitchDeckSlide, index: number }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                 <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold">
                            {index + 1}
                        </span>
                        {slide.title}
                    </CardTitle>
                    {slide.subtitle && <CardDescription>{slide.subtitle}</CardDescription>}
                 </div>
                 <Badge variant="outline">{slide.type}</Badge>
            </CardHeader>
            <CardContent>
                <ul className="list-disc list-inside space-y-2 ml-2">
                    {slide.bullets.map((bullet, i) => (
                        <li key={i} className="text-slate-700 dark:text-slate-300">
                            {bullet}
                        </li>
                    ))}
                </ul>
            </CardContent>
            {slide.speakerNotes && (
                <CardFooter className="bg-muted/30 pt-4">
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="notes" className="border-none">
                            <AccordionTrigger className="py-0 text-xs text-muted-foreground hover:no-underline hover:text-foreground">
                                <span className="flex items-center gap-2">
                                    <Mic2 className="h-3 w-3" />
                                    Speaker Notes
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground pt-2 italic">
                                {slide.speakerNotes}
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardFooter>
            )}
        </Card>
    );
}
