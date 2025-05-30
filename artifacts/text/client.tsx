/**
 * Text Artifact Client Implementation
 *
 * This file defines the client-side implementation of the text artifact type.
 * It handles rendering, interaction, and state management for text documents.
 *
 * Features:
 * - Rich text editor integration
 * - Version history navigation
 * - Diff view for comparing versions
 * - Suggestion system for content improvement
 * - Toolbar actions for document enhancement
 *
 * The text artifact is used for creating and editing text-based content like
 * essays, emails, and other written documents with version control support.
 */

import { Artifact } from '@/components/create-artifact';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { Editor } from '@/components/text-editor';
import { DiffView } from '@/components/diffview';
import {
  ClockRewind,
  CopyIcon,
  MessageIcon,
  PenIcon,
  RedoIcon,
  UndoIcon,
} from '@/components/icons';
import { toast } from 'sonner';
import { getSuggestions } from '../actions';
import type { Suggestion } from '@/lib/schema';

/**
 * Interface defining metadata structure for text artifacts
 * Includes suggestions array for content improvement recommendations
 */
interface TextArtifactMetadata {
  suggestions: Array<Suggestion>;
}

/**
 * Text Artifact definition
 *
 * Creates a new text artifact type with specific behaviors and UI components
 */
export const textArtifact = new Artifact<'text', TextArtifactMetadata>({
  kind: 'text',
  description: 'Useful for text content, like drafting essays and emails.',

  /**
   * Initializes a text artifact by loading its suggestions
   * @param documentId - The document ID to load
   * @param setMetadata - Function to update artifact metadata
   */
  initialize: async ({ documentId, setMetadata }) => {
    const suggestions = await getSuggestions({ documentId });

    setMetadata({
      suggestions,
    });
  },

  /**
   * Handles streaming updates to the artifact
   * Processes both suggestions and text content updates
   */
  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    // Handle incoming suggestion updates
    if (streamPart.type === 'suggestion') {
      setMetadata((metadata) => {
        return {
          suggestions: [
            ...metadata.suggestions,
            streamPart.content as unknown as Suggestion,
          ],
        };
      });
    }

    // Handle incoming text content updates
    if (streamPart.type === 'text-delta') {
      setArtifact((draftArtifact) => {
        return {
          ...draftArtifact,
          content: streamPart.content as string,
          isVisible: true,
          status: 'streaming',
        };
      });
    }
  },

  /**
   * Renders the text artifact content based on current mode and state
   * Supports edit mode, diff mode, and loading states
   */
  content: ({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) => {
    // Display loading skeleton while content is being fetched
    if (isLoading) {
      return <DocumentSkeleton artifactKind="text" />;
    }

    // Show diff view when comparing versions
    if (mode === 'diff') {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);

      return <DiffView oldContent={oldContent} newContent={newContent} />;
    }

    // Standard editor view
    return (
      <>
        <div className="flex flex-row py-8 md:p-20 px-4">
          <Editor
            content={content}
            suggestions={metadata ? metadata.suggestions : []}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status={status}
            onSaveContent={onSaveContent}
          />

          {/* Spacer for mobile view when suggestions are present */}
          {metadata?.suggestions?.length > 0 ? (
            <div className="md:hidden h-dvh w-12 shrink-0" />
          ) : null}
        </div>
      </>
    );
  },

  /**
   * Action buttons displayed in the artifact interface
   * Provides version navigation and clipboard functionality
   */
  actions: [
    {
      icon: <ClockRewind size={18} />,
      description: 'View changes',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('toggle');
      },
      isDisabled: ({ currentVersionIndex, setMetadata }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy to clipboard',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
  ],

  /**
   * Toolbar buttons for content enhancement
   * Provides quick access to common text operations
   */
  toolbar: [
    {
      icon: <PenIcon />,
      description: 'Add final polish',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add final polish and check for grammar, add section titles for better structure, and ensure everything reads smoothly.',
        });
      },
    },
    {
      icon: <MessageIcon />,
      description: 'Request suggestions',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please add suggestions you have that could improve the writing.',
        });
      },
    },
  ],
});
