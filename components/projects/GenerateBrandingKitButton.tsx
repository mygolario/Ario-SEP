'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GenerateBrandingKitButtonProps {
  projectId: string;
}

export default function GenerateBrandingKitButton({ projectId }: GenerateBrandingKitButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/branding-kit`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate branding kit');
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
                در حال ساخت بسته برند...
            </>
        ) : (
            <>
                <Palette className="h-5 w-5" />
                ساخت بسته برند با هوش مصنوعی
            </>
        )}
    </Button>
  );
}
