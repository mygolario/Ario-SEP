import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import StrategyMap from '@/components/StrategyMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StartupPlan } from '@/lib/types';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
    include: {
      strategyMap: true,
    },
  });

  if (!project) {
    notFound();
  }

  if (project.userId !== session.user.id) {
    // Basic authorization check - strictly checking ID
    // Could also just notFound() to hide existence
    redirect('/dashboard'); 
  }

  if (!project.strategyMap?.data) {
     return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Project found, but no strategy map data available.</h1>
            <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
     )
  }

  // Cast Json to StartupPlan
  const plan = project.strategyMap.data as unknown as StartupPlan;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/dashboard">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {project.title}
                </h1>
                <p className="text-sm text-slate-500">
                  Created {project.createdAt.toLocaleDateString()}
                </p>
              </div>
           </div>
           <a href={`/api/export-pdf/${project.id}`} target="_blank" rel="noopener noreferrer">
             <Button variant="outline">
               Download PDF
             </Button>
           </a>
        </header>

        <section>
          <StrategyMap plan={plan} />
        </section>
      </div>
    </main>
  );
}
