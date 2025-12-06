'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BrandingKitGeneratorProps {
  projectId: string;
}

export default function BrandingKitGenerator({ projectId }: BrandingKitGeneratorProps) {
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
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-card text-card-foreground min-h-[400px]">
      <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-full mb-6 relative">
         <Palette className="h-10 w-10 text-pink-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">AI Branding Kit</h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Instantly generate a complete visual identity and messaging strategy for your startup.
        Includes color palettes, typography, tone of voice, and more.
      </p>
      
      <Button 
        size="lg" 
        onClick={handleGenerate} 
        disabled={loading}
        className="bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/20"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Designing Brand...
          </>
        ) : (
          <>
            <Palette className="mr-2 h-5 w-5" />
            Generate Branding Kit
          </>
        )}
      </Button>
      {loading && (
          <p className="text-xs text-muted-foreground mt-4 animate-pulse">
            This usually takes about 20-40 seconds...
          </p>
      )}
    </div>
  );
}
