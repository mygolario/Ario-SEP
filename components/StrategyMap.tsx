import { StartupPlan } from '@/lib/types';
import SummarySection from './strategy-map/SummarySection';
import KeyBlocksGrid from './strategy-map/KeyBlocksGrid';
import RoadmapBoard from './strategy-map/RoadmapBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StrategyMapProps {
  plan: StartupPlan;
}

export default function StrategyMap({ plan }: StrategyMapProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      <SummarySection data={plan.summary} />
      
      <KeyBlocksGrid blocks={plan.keyBlocks} />
      
      <RoadmapBoard roadmap={plan.roadmap} />

      {plan.notes && plan.notes.length > 0 && (
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
          <CardHeader>
            <CardTitle className="text-lg text-yellow-800 dark:text-yellow-200">
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-yellow-900 dark:text-yellow-100/80">
              {plan.notes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
