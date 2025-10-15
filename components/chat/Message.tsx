'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface MessageProps {
  role: 'therapist' | 'twin';
  content: string;
  isLatest: boolean;
}

export function Message({ role, content, isLatest }: MessageProps) {
  return (
    <motion.div
      className={cn(
        'w-[80%]',
        'rounded-lg border',
        role === 'therapist'
          ? 'ml-auto border-primary/20 bg-primary/10'
          : 'mr-auto border-secondary/20 bg-secondary/70',
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
    >
      <div className="flex items-center gap-2 px-3 pt-4 text-xs font-medium leading-none">
        <span>{role === 'therapist' ? 'You' : 'Digital Twin'}</span>
        {isLatest && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            <span>transcribing...</span>
          </div>
        )}
      </div>
      <div className="p-3">{content}</div>
    </motion.div>
  );
}
