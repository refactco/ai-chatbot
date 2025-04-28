'use client';

import { isAfter } from 'date-fns';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { useWindowSize } from 'usehooks-ts';

import type { Document } from '@/lib/schema';
import { getDocumentTimestampByIndex } from '@/lib/utils';

import { LoaderIcon } from './icons';
import { Button } from './ui/button';
import { useArtifact } from '@/hooks/use-artifact';

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

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);

  // Determine if we're using local storage or API
  const isLocalDocument =
    artifact.documentId?.startsWith('local:') ||
    artifact.documentId?.startsWith('text:') ||
    artifact.documentId?.startsWith('sheet:') ||
    artifact.documentId?.startsWith('http:') ||
    artifact.documentId?.includes('placehold.co');

  const localStorageKey = `local-document-${
    artifact.documentId?.startsWith('local:')
      ? artifact.documentId.substring(6)
      : artifact.documentId
  }`;

  // Handle restoring local document version
  const handleLocalRestore = useCallback(() => {
    if (!documents || currentVersionIndex < 0) return;

    setIsMutating(true);
    console.log('Restoring local version:', currentVersionIndex);
    console.log('Current documents:', documents);

    try {
      // Get current version timestamp for comparison
      const currentTimestamp = documents[currentVersionIndex].createdAt;
      console.log('Selected version timestamp:', currentTimestamp);

      // Filter out all versions after this one
      const restoredVersions = documents.filter(
        (doc) => !isAfter(new Date(doc.createdAt), new Date(currentTimestamp)),
      );
      console.log('Filtered versions to keep:', restoredVersions);

      // Save to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(restoredVersions));
      console.log('Saved to localStorage with key:', localStorageKey);

      // Update parent component state directly instead of page reload
      if (window.location) {
        console.log('Reloading page to apply changes');
        window.location.reload();
      } else {
        console.log('No window.location, changes might not apply immediately');
      }
    } catch (error) {
      console.error('Error restoring local version:', error);
    } finally {
      setIsMutating(false);
    }
  }, [documents, currentVersionIndex, localStorageKey]);

  if (!documents) {
    console.log('No documents available for version footer');
    return null;
  }

  // Debug version information
  console.log('Version footer rendering with:', {
    documentId: artifact.documentId,
    isLocalDocument,
    localStorageKey,
    documentsCount: documents.length,
    currentVersionIndex,
  });

  return (
    <motion.div
      className="absolute flex flex-col gap-4 lg:flex-row bottom-0 bg-background p-4 w-full border-t z-50 justify-between"
      initial={{ y: isMobile ? 200 : 77 }}
      animate={{ y: 0 }}
      exit={{ y: isMobile ? 200 : 77 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
    >
      <div>
        <div>You are viewing a previous version</div>
        <div className="text-muted-foreground text-sm">
          Restore this version to make edits
        </div>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          disabled={isMutating}
          onClick={async () => {
            if (isLocalDocument) {
              handleLocalRestore();
            } else {
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
