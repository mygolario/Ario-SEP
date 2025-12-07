'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutTemplate,
  Layers,
  Palette,
  Layout,
  ShieldCheck,
  Presentation,
  HandCoins,
  CheckCircle,
  Settings,
  Home
} from 'lucide-react';

export const projectSections = [
  { id: 'overview', label: 'نمای کلی', icon: Home },
  { id: 'one-page', label: 'برنامه یک‌صفحه‌ای', icon: LayoutTemplate },
  { id: 'deep-plan', label: 'برنامه عمیق', icon: Layers },
  { id: 'branding', label: 'بسته برندسازی', icon: Palette },
  { id: 'landing-page', label: 'صفحه لندینگ', icon: Layout },
  { id: 'market-analysis', label: 'بازار و رقبا', icon: ShieldCheck },
  { id: 'pitch-deck', label: 'ارائه سرمایه‌گذاری', icon: Presentation },
  { id: 'funding', label: 'نقشه راه تأمین مالی', icon: HandCoins },
  { id: 'execution', label: 'مربی اجرا', icon: CheckCircle },
  { id: 'settings', label: 'تنظیمات', icon: Settings },
];

interface ProjectSidebarProps {
  projectId: string;
  className?: string;
  onNavigate?: () => void;
}

export function ProjectSidebar({ projectId, className, onNavigate }: ProjectSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 w-64 border-r bg-background/95 backdrop-blur-sm support-[backdrop-filter]:bg-background/60", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            پروژه
          </h2>
          <div className="space-y-1">
            {projectSections.map((section) => {
              const href = `/project/${projectId}/${section.id}`;
              const isActive = pathname === href;
              return (
                <Link key={section.id} href={href} onClick={onNavigate}>
                    <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                        <section.icon className="ml-2 h-4 w-4" />
                        {section.label}
                    </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
