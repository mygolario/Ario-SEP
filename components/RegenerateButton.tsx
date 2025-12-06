'use client';

import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegenerateButtonProps {
  projectId: string;
}

export default function RegenerateButton({ projectId }: RegenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegenerate = async () => {
    if (!confirm('Are you sure you want to regenerate the plan? This will create a new version based on your original idea.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/regenerate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to regenerate plan');
      }

      // Refresh the page to show new data
      router.refresh();
    } catch (err: any) {
      console.error('Regeneration failed:', err);
      alert(err.message || 'Failed to regenerate plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleRegenerate}
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Regenerating...' : 'Regenerate Plan'}
    </Button>
  );
}
