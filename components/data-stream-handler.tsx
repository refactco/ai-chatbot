'use client';

import { useEffect, useRef, useState } from 'react';
import { artifactDefinitions, type ArtifactKind } from './artifact';
import { initialArtifactData, useArtifact } from '@/hooks/use-artifact';

// Define Suggestion type here since we can't import it
interface Suggestion {
  id: string;
  text: string;
}

export type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind';
  content: string | Suggestion;
};

export function DataStreamHandler({ id }: { id: string }) {
  // Instead of using useChat, we'll use a simple state for now
  const [dataStream, setDataStream] = useState<DataStreamDelta[]>([]);
  const { artifact, setArtifact, setMetadata } = useArtifact();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    newDeltas.forEach((delta: DataStreamDelta) => {
      const artifactDefinition = artifactDefinitions.find(
        (artifactDefinition) => artifactDefinition.kind === artifact.kind,
      );

      if (artifactDefinition?.onStreamPart) {
        artifactDefinition.onStreamPart({
          streamPart: delta,
          setArtifact,
          setMetadata,
        });
      }

      setArtifact((draftArtifact) => {
        if (!draftArtifact) {
          return { ...initialArtifactData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'id':
            return {
              ...draftArtifact,
              documentId: delta.content as string,
              status: 'streaming',
            };

          case 'title':
            return {
              ...draftArtifact,
              title: delta.content as string,
              status: 'streaming',
            };

          case 'kind':
            return {
              ...draftArtifact,
              kind: delta.content as ArtifactKind,
              status: 'streaming',
            };

          case 'clear':
            return {
              ...draftArtifact,
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              ...draftArtifact,
              status: 'idle',
            };

          default:
            return draftArtifact;
        }
      });
    });
  }, [dataStream, setArtifact, setMetadata, artifact]);

  // We'll add a method to update the data stream from outside
  // This will be important when we integrate with the real API
  useEffect(() => {
    // Add the component to the window so it can be accessed from outside
    if (typeof window !== 'undefined') {
      (window as any).__dataStreamHandler = {
        addStreamDelta: (delta: DataStreamDelta) => {
          setDataStream((prev) => [...prev, delta]);
        },
        clearStream: () => {
          setDataStream([]);
          lastProcessedIndex.current = -1;
        },
      };
    }

    return () => {
      // Clean up when the component unmounts
      if (typeof window !== 'undefined') {
        (window as any).__dataStreamHandler = undefined;
      }
    };
  }, []);

  return null;
}
