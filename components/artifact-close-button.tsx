/**
 * Artifact Close Button Component
 *
 * This component provides a button to close the currently open artifact.
 * Features:
 * - Handles different close behaviors based on artifact status
 * - Maintains visibility of streaming artifacts while hiding UI
 * - Resets to initial artifact state for completed artifacts
 * - Memoized to prevent unnecessary rerenders
 * - Consistent styling with the design system
 *
 * Used in the artifact header to allow users to exit from
 * the artifact view and return to the main chat interface.
 */

import { memo } from 'react';
import { CrossIcon } from './icons';
import { Button } from './ui/button';
import { initialArtifactData, useArtifact } from '@/hooks/use-artifact';

function PureArtifactCloseButton() {
  const { setArtifact } = useArtifact();

  return (
    <Button
      data-testid="artifact-close-button"
      variant="outline"
      className="h-fit p-2 dark:hover:bg-zinc-700"
      onClick={() => {
        setArtifact((currentArtifact) =>
          currentArtifact.status === 'streaming'
            ? {
                ...currentArtifact,
                isVisible: false,
              }
            : { ...initialArtifactData, status: 'idle' },
        );
      }}
    >
      <CrossIcon size={18} />
    </Button>
  );
}

export const ArtifactCloseButton = memo(PureArtifactCloseButton, () => true);
