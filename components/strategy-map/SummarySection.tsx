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
        <CardTitle className="text-2xl text-right">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" dir="rtl">
        <div className="text-right">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">الویتور پیچ (معرفی آسانسوری)</h4>
          <p className="text-lg font-medium">{data.elevatorPitch}</p>
        </div>
        <div className="text-right">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">هدف اصلی</h4>
          <p className="text-base">{data.coreGoal}</p>
        </div>
      </CardContent>
    </Card>
  );
}
