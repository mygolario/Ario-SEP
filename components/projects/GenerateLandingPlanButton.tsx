'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, LayoutTemplate } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GenerateLandingPlanButtonProps {
  projectId: string;
}

export default function GenerateLandingPlanButton({ projectId }: GenerateLandingPlanButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/landing-page-plan`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate landing plan');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
        size="lg" 
        onClick={handleGenerate} 
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 font-semibold gap-2 transition-all"
    >
        {loading ? (
            <>
                <Loader2 className="h-5 w-5 animate-spin" />
                در حال ساخت ساختار لندینگ...
            </>
        ) : (
            <>
                <LayoutTemplate className="h-5 w-5" />
                ساخت ساختار لندینگ با هوش مصنوعی
            </>
        )}
    </Button>
  );
}
