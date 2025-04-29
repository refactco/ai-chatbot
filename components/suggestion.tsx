/**
 * Suggestion Component
 *
 * This component renders interactive suggestion bubbles for text artifacts.
 * Features:
 * - Collapsed/expanded state toggle with smooth animations
 * - Position anchoring to text selection points
 * - Responsive sizing for mobile and desktop displays
 * - Visual feedback with hover effects
 * - Apply button for accepting suggestions
 * - Consistent theming with application design system
 *
 * Used within the text editor to provide inline suggestions and improvements
 * from the AI assistant, allowing users to easily review and apply them.
 */

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { CrossIcon, MessageIcon } from './icons';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { ArtifactKind } from './artifact';
import type { Suggestion as SuggestionType } from '@/lib/schema';

/**
 * Extended interface for UI suggestions with positioning data
 * Adds client-side properties for rendering and interaction
 */
interface UISuggestion extends SuggestionType {
  id: string;
  description: string;
  selectionStart?: number;
  selectionEnd?: number;
}

/**
 * Props for the Suggestion component
 * @property suggestion - The suggestion data to display
 * @property onApply - Callback function when suggestion is applied
 * @property artifactKind - Type of artifact this suggestion applies to
 */
export const Suggestion = ({
  suggestion,
  onApply,
  artifactKind,
}: {
  suggestion: UISuggestion;
  onApply: () => void;
  artifactKind: ArtifactKind;
}) => {
  // State to track expanded/collapsed view
  const [isExpanded, setIsExpanded] = useState(false);
  const { width: windowWidth } = useWindowSize();

  return (
    <AnimatePresence>
      {!isExpanded ? (
        // Collapsed state - shows just an icon button
        <motion.div
          className={cn('cursor-pointer text-muted-foreground p-1', {
            'absolute -right-8': artifactKind === 'text',
          })}
          onClick={() => {
            setIsExpanded(true);
          }}
          whileHover={{ scale: 1.1 }}
        >
          <MessageIcon size={windowWidth && windowWidth < 768 ? 16 : 14} />
        </motion.div>
      ) : (
        // Expanded state - shows suggestion bubble with details
        <motion.div
          key={suggestion.id}
          className="absolute bg-background p-3 flex flex-col gap-3 rounded-2xl border text-sm w-56 shadow-xl z-50 -right-12 md:-right-16 font-sans"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -20 }}
          exit={{ opacity: 0, y: -10 }}
          whileHover={{ scale: 1.05 }}
        >
          {/* Header with assistant info and close button */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <div className="size-4 bg-muted-foreground/25 rounded-full" />
              <div className="font-medium">Assistant</div>
            </div>
            <button
              type="button"
              className="text-xs text-gray-500 cursor-pointer"
              onClick={() => {
                setIsExpanded(false);
              }}
            >
              <CrossIcon size={12} />
            </button>
          </div>

          {/* Suggestion content */}
          <div>{suggestion.description}</div>

          {/* Apply button to accept suggestion */}
          <Button
            variant="outline"
            className="w-fit py-1.5 px-3 rounded-full"
            onClick={onApply}
          >
            Apply
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
