/**
 * Artifact Hook
 *
 * This file provides hooks for managing and accessing artifact state.
 * It enables components to work with artifacts in a consistent way.
 *
 * Features:
 * - Global artifact state management
 * - Selector pattern for optimized rerenders
 * - Type-safe artifact metadata handling
 * - Initial state configuration
 *
 * These hooks are central to the artifact system, providing a unified way
 * to access and modify artifact data throughout the application.
 */

'use client';

import useSWR from 'swr';
import type { UIArtifact } from '@/components/artifact';
import { useCallback, useMemo } from 'react';

/**
 * Default initial state for an artifact
 * Used when no artifact data is available yet
 */
export const initialArtifactData: UIArtifact = {
  documentId: 'init',
  content: '',
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

/**
 * Type definition for a selector function
 * Used to extract specific pieces of state from an artifact
 */
type Selector<T> = (state: UIArtifact) => T;

/**
 * Hook for selecting specific parts of the artifact state
 * Provides performance optimization by preventing unnecessary rerenders
 *
 * @param selector - Function to extract the desired state from the artifact
 * @returns The selected state derived from the artifact
 */
export function useArtifactSelector<Selected>(selector: Selector<Selected>) {
  const { data: localArtifact } = useSWR<UIArtifact>('artifact', null, {
    fallbackData: initialArtifactData,
  });

  const selectedValue = useMemo(() => {
    if (!localArtifact) return selector(initialArtifactData);
    return selector(localArtifact);
  }, [localArtifact, selector]);

  return selectedValue;
}

/**
 * Primary hook for artifact state management
 * Provides access to the current artifact state and methods to update it
 *
 * @returns Object containing the artifact state, metadata, and setter functions
 */
export function useArtifact() {
  // Get and set the artifact state
  const { data: localArtifact, mutate: setLocalArtifact } = useSWR<UIArtifact>(
    'artifact',
    null,
    {
      fallbackData: initialArtifactData,
    },
  );

  // Provide a fallback when no artifact is available
  const artifact = useMemo(() => {
    if (!localArtifact) return initialArtifactData;
    return localArtifact;
  }, [localArtifact]);

  /**
   * Function to update the artifact state
   * Accepts either a new state object or an updater function
   */
  const setArtifact = useCallback(
    (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => {
      setLocalArtifact((currentArtifact) => {
        const artifactToUpdate = currentArtifact || initialArtifactData;

        if (typeof updaterFn === 'function') {
          return updaterFn(artifactToUpdate);
        }

        return updaterFn;
      });
    },
    [setLocalArtifact],
  );

  // Get and set metadata associated with the current artifact
  const { data: localArtifactMetadata, mutate: setLocalArtifactMetadata } =
    useSWR<any>(
      () =>
        artifact.documentId ? `artifact-metadata-${artifact.documentId}` : null,
      null,
      {
        fallbackData: null,
      },
    );

  // Return a stable object with all the artifact-related state and functions
  return useMemo(
    () => ({
      artifact,
      setArtifact,
      metadata: localArtifactMetadata,
      setMetadata: setLocalArtifactMetadata,
    }),
    [artifact, setArtifact, localArtifactMetadata, setLocalArtifactMetadata],
  );
}
