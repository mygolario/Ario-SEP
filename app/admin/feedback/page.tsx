import prisma from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminFeedbackPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, name: true },
      },
      // We can't easily include project title without a relation validation, 
      // but assuming we added project relation in schema, or we just show ID.
      // Wait, schema has projectId string but no relation back to Project defined in Feedback model? 
      // Let's check schema. User said: 
      // projectId  String?  // optional link to a project
      // It didn't explicitly say relation. But let's check schema.prisma first or just show ID.
      // Actually Implementation Plan said "projectId (link to project if exists)".
    },
    take: 100,
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Feedback Admin
        </h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
            Total: {feedbacks.length}
        </Badge>
      </div>

      <div className="border rounded-lg shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="w-[150px]">Project</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No feedback found.
                    </TableCell>
                </TableRow>
            ) : (
                feedbacks.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                    <Badge
                        variant={
                        item.type === 'BUG'
                            ? 'destructive'
                            : item.type === 'IDEA'
                            ? 'default'
                            : 'secondary'
                        }
                    >
                        {item.type}
                    </Badge>
                    </TableCell>
                    <TableCell className="max-w-md wrap-break-word">
                        {item.message}
                    </TableCell>
                    <TableCell>
                    {item.user ? (
                        <div className="flex flex-col text-sm">
                        <span className="font-semibold">{item.user.name}</span>
                        <span className="text-muted-foreground text-xs">{item.user.email}</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground italic">Anonymous</span>
                    )}
                    </TableCell>
                    <TableCell>
                    {item.projectId ? (
                        <Link 
                            href={`/project/${item.projectId}`} 
                            target="_blank"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                        >
                            {item.projectId.substring(0, 8)}...
                            <ExternalLink className="h-3 w-3" />
                        </Link>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
