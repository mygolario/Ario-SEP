import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      strategyMaps: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage your startup ideas and execution plans.
            </p>
          </div>
          <Link href="/">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Idea
            </Button>
          </Link>
        </header>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by generating your first execution plan.
            </p>
            <Link href="/">
              <Button variant="outline">Create Project</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              // Safe cast for summary which is Json type
              const summary = project.strategyMaps?.[0]?.summary as { elevatorPitch?: string; coreGoal?: string } | undefined;
              
              return (
                <Card key={project.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                       {/* Show description or target audience */}
                       {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grow">
                    {summary?.elevatorPitch && (
                        <p className="text-sm text-muted-foreground line-clamp-3 italic">
                          &quot;{summary.elevatorPitch}&quot;
                        </p>
                    )}
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-muted/20">
                    <Link href={`/project/${project.id}`} className="w-full">
                      <Button variant="ghost" className="w-full justify-between">
                        View Strategy
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
