import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface KeyBlock {
  label: string;
  content: string;
}

interface KeyBlocksGridProps {
  blocks: KeyBlock[];
}

export default function KeyBlocksGrid({ blocks }: KeyBlocksGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" dir="rtl">
      {blocks.map((block, index) => (
        <Card key={index} className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold uppercase text-muted-foreground text-right">
              {block.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-right">{block.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
