import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { ProjectSidebar } from '@/components/sidebar/ProjectSidebar';
import { MobileNav } from '@/components/sidebar/MobileNav';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      userId: true,
    }
  });

  if (!project) {
    notFound();
  }
  
  if (project.userId !== user.id) {
     redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 border-b bg-background">
         <MobileNav projectId={project.id} />
         <span className="font-semibold ml-2 truncate">{project.title}</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed h-full inset-y-0 z-50">
         <div className="h-14 flex items-center border-b px-4 bg-background">
             <Link href="/dashboard" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
               <ArrowLeft className="h-4 w-4" />
               Back
             </Link>
         </div>
         <ProjectSidebar projectId={project.id} className="flex-1 w-full" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
             <div className="md:hidden flex items-center gap-2 mb-6">
                 <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
             </div>
            {children}
        </div>
      </main>
    </div>
  );
}
