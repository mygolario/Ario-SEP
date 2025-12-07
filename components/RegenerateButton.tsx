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
    if (!confirm('آیا مطمئن هستید که می‌خواهید پلن را بازسازی کنید؟ این کار یک نسخه جدید بر اساس ایده اولیه شما ایجاد می‌کند.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/regenerate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'بازسازی پلن با شکست مواجه شد');
      }

      // Refresh the page to show new data
      router.refresh();
    } catch (err: any) {
      console.error('Regeneration failed:', err);
      alert(err.message || 'بازسازی پلن با شکست مواجه شد');
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
      {isLoading ? 'در حال بازسازی...' : 'بازسازی پلن'}
    </Button>
  );
}
