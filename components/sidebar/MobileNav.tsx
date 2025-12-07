'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { ProjectSidebar } from './ProjectSidebar';
import { useState } from 'react';

interface MobileNavProps {
  projectId: string;
}

export function MobileNav({ projectId }: MobileNavProps) {
    const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
           <Menu className="h-5 w-5" />
           <span className="sr-only">منو</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <ProjectSidebar projectId={projectId} onNavigate={() => setOpen(false)} className="w-full border-none" />
      </SheetContent>
    </Sheet>
  );
}
