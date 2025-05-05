/**
 * Version Footer Component
 *
 * This component provides version control UI for artifacts, allowing users to
 * navigate through document history and manage versions.
 * Features:
 * - Version timeline display with timestamp indicators
 * - Navigation between document versions
 * - Visual indicators for current vs. historical versions
 * - Version restoration functionality for both API and localStorage backends
 * - Optimistic UI updates for version operations
 * - Responsive layout for mobile and desktop
 *
 * The component integrates with the artifact system to provide consistent
 * version control across different artifact types (text, image, sheet).
 */

'use client';

import { isAfter } from 'date-fns';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useSWRConfig } from 'swr';
import { useWindowSize } from 'usehooks-ts';

import type { Document } from '@/lib/schema';
import { getDocumentTimestampByIndex } from '@/lib/utils';

import { useArtifact } from '@/hooks/use-artifact';
import { LoaderIcon } from './icons';
import { Button } from './ui/button';

/**
 * Props for the VersionFooter component
 * @property handleVersionChange - Function to navigate between versions
 * @property documents - Array of document versions
 * @property currentVersionIndex - Index of the currently displayed version
 */
interface VersionFooterProps {
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void;
  documents: Array<Document> | undefined;
  currentVersionIndex: number;
}

export const VersionFooter = ({
  handleVersionChange,
  documents,
  currentVersionIndex,
}: VersionFooterProps) => {
  const { artifact } = useArtifact();

  // Detect if on mobile for responsive layout adjustments
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);

  // Determine storage type based on document ID format
  const isLocalDocument =
    artifact.documentId?.startsWith('local:') ||
    artifact.documentId?.startsWith('text:') ||
    artifact.documentId?.startsWith('sheet:') ||
    artifact.documentId?.startsWith('http:') ||
    artifact.documentId?.includes('placehold.co');

  // Create localStorage key for local documents
  const localStorageKey = `local-document-${
    artifact.documentId?.startsWith('local:')
      ? artifact.documentId.substring(6)
      : artifact.documentId
  }`;

  /**
   * Handles restoring a local document version by:
   * 1. Filtering out all versions after selected version
   * 2. Saving filtered versions to localStorage
   * 3. Reloading page to apply changes
   */
  const handleLocalRestore = useCallback(() => {
    if (!documents || currentVersionIndex < 0) return;

    setIsMutating(true);

    try {
      // Get current version timestamp for comparison
      const currentTimestamp = documents[currentVersionIndex].createdAt;

      // Filter out all versions after this one
      const restoredVersions = documents.filter(
        (doc) => !isAfter(new Date(doc.createdAt), new Date(currentTimestamp)),
      );

      // Save to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(restoredVersions));

      // Update parent component state directly instead of page reload
      if (window.location) {
        window.location.reload();
      }
    } catch (error) {
    } finally {
      setIsMutating(false);
    }
  }, [documents, currentVersionIndex, localStorageKey]);

  if (!documents) {
    return null;
  }

  return (
    <motion.div
      className="absolute flex flex-col gap-4 lg:flex-row bottom-0 bg-background p-4 w-full border-t z-50 justify-between"
      initial={{ y: isMobile ? 200 : 77 }}
      animate={{ y: 0 }}
      exit={{ y: isMobile ? 200 : 77 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
    >
      {/* Information section explaining current state */}
      <div>
        <div>You are viewing a previous version</div>
        <div className="text-muted-foreground text-sm">
          Restore this version to make edits
        </div>
      </div>

      {/* Action buttons for version management */}
      <div className="flex flex-row gap-4">
        <Button
          disabled={isMutating}
          onClick={async () => {
            if (isLocalDocument) {
              // Handle local storage document restoration
              handleLocalRestore();
            } else {
              // Handle API-based document restoration with optimistic updates
              setIsMutating(true);

              mutate(
                `/api/document?id=${artifact.documentId}`,
                await fetch(
                  `/api/document?id=${artifact.documentId}&timestamp=${getDocumentTimestampByIndex(
                    documents,
                    currentVersionIndex,
                  )}`,
                  {
                    method: 'DELETE',
                  },
                ),
                {
                  optimisticData: documents
                    ? [
                        ...documents.filter((document) =>
                          isAfter(
                            new Date(document.createdAt),
                            new Date(
                              getDocumentTimestampByIndex(
                                documents,
                                currentVersionIndex,
                              ),
                            ),
                          ),
                        ),
                      ]
                    : [],
                },
              );
            }
          }}
        >
          <div>Restore this version</div>
          {isMutating && (
            <div className="animate-spin">
              <LoaderIcon />
            </div>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleVersionChange('latest');
          }}
        >
          Back to latest version
        </Button>
      </div>
    </motion.div>
  );
};
