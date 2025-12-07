import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RoadmapPhase {
  label: string;
  items: string[];
}

interface RoadmapBoardProps {
  roadmap: RoadmapPhase[];
}

export default function RoadmapBoard({ roadmap }: RoadmapBoardProps) {
  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-xl font-bold text-right">نقشه راه اجرایی</h3>
      <div className="flex overflow-x-auto gap-4 pb-4">
        {roadmap.map((phase, index) => (
          <Card key={index} className="min-w-[280px] md:min-w-[320px] shrink-0">
            <CardHeader className="bg-muted/50 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wide text-right">
                {phase.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pr-5 space-y-2 text-right">
                {phase.items.map((item, i) => (
                  <li key={i} className="text-sm">{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
