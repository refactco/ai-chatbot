'use client';

import { useState } from 'react';
import { BrainIcon } from './icons';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Markdown } from './markdown';

interface MessageReasoningProps {
  reasoning: string;
}

export function MessageReasoning({ reasoning }: MessageReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reasoning) return null;

  return (
    <div className="flex flex-col w-full pl-12 mt-1 mb-2">
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground w-fit px-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <BrainIcon size={14} />
        <span>{isExpanded ? 'Hide reasoning' : 'View reasoning'}</span>
      </Button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border"
        >
          <div className="text-xs font-medium mb-1 text-foreground/80">
            AI Reasoning Process:
          </div>
          <Markdown>{reasoning}</Markdown>
        </motion.div>
      )}
    </div>
  );
}
