'use client';

import { Button } from './ui/button';
import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareLinkButtonProps {
  publicId: string;
}

export default function ShareLinkButton({ publicId }: ShareLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/p/${publicId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleCopy}
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? 'کپی شد' : 'اشتراک‌گذاری لینک عمومی'}
    </Button>
  );
}
