import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SummarySectionProps {
  data: {
    title: string;
    elevatorPitch: string;
    coreGoal: string;
  };
}

export default function SummarySection({ data }: SummarySectionProps) {
  return (
    <Card className="mb-6 border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle className="text-2xl">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Elevator Pitch</h4>
          <p className="text-lg font-medium">{data.elevatorPitch}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Core Goal</h4>
          <p className="text-base">{data.coreGoal}</p>
        </div>
      </CardContent>
    </Card>
  );
}
