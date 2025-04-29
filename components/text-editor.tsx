/**
 * Text Editor Component
 *
 * This component provides a rich text editing experience for the text artifact type.
 * Features:
 * - ProseMirror-based rich text editing with content structure
 * - Support for inline suggestions and feedback
 * - Integration with version control system for historical views
 * - Debounced auto-save functionality
 * - Real-time content updates during streaming
 * - Memory optimization through React memo
 * - Markdown-style syntax support (headings, etc.)
 *
 * This component serves as the main editor for text artifacts, handling both
 * content editing and suggestion UI while maintaining document structure.
 */

'use client';

import { exampleSetup } from 'prosemirror-example-setup';
import { inputRules } from 'prosemirror-inputrules';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { memo, useEffect, useRef } from 'react';

import type { Suggestion } from '@/lib/schema';
import {
  documentSchema,
  handleTransaction,
  headingRule,
} from '@/lib/editor/config';
import {
  buildContentFromDocument,
  buildDocumentFromContent,
  createDecorations,
} from '@/lib/editor/functions';
import {
  projectWithPositions,
  suggestionsPlugin,
  suggestionsPluginKey,
} from '@/lib/editor/suggestions';

/**
 * Props for the Editor component
 * @property content - Text content to display and edit
 * @property onSaveContent - Callback to save content changes
 * @property status - Current editor status (streaming/idle)
 * @property isCurrentVersion - Whether viewing the latest version
 * @property currentVersionIndex - Index of the current version
 * @property suggestions - Array of suggestions to display
 */
type EditorProps = {
  content: string;
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  status: 'streaming' | 'idle';
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  suggestions: Array<Suggestion>;
};

function PureEditor({
  content,
  onSaveContent,
  suggestions,
  status,
}: EditorProps) {
  // Reference to the container DOM element for ProseMirror
  const containerRef = useRef<HTMLDivElement>(null);
  // Reference to the ProseMirror editor instance
  const editorRef = useRef<EditorView | null>(null);

  /**
   * Initialize ProseMirror editor on component mount
   * Sets up the schema, plugins, and input rules
   */
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      // Create initial editor state with schema and plugins
      const state = EditorState.create({
        doc: buildDocumentFromContent(content),
        plugins: [
          ...exampleSetup({ schema: documentSchema, menuBar: false }),
          inputRules({
            rules: [
              // Add markdown-style heading rules (# for h1, ## for h2, etc.)
              headingRule(1),
              headingRule(2),
              headingRule(3),
              headingRule(4),
              headingRule(5),
              headingRule(6),
            ],
          }),
          suggestionsPlugin,
        ],
      });

      // Create the editor view and attach to DOM
      editorRef.current = new EditorView(containerRef.current, {
        state,
      });
    }

    // Clean up editor on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // NOTE: we only want to run this effect once
    // eslint-disable-next-line
  }, []);

  /**
   * Set up transaction handling for content changes
   * This enables content saving when changes are made
   */
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setProps({
        dispatchTransaction: (transaction) => {
          handleTransaction({
            transaction,
            editorRef,
            onSaveContent,
          });
        },
      });
    }
  }, [onSaveContent]);

  /**
   * Handle content updates from external sources
   * Updates the editor when content changes from props
   * Uses different behaviors for streaming vs. static updates
   */
  useEffect(() => {
    if (editorRef.current && content) {
      const currentContent = buildContentFromDocument(
        editorRef.current.state.doc,
      );

      // Handle streaming mode differently - continuous updates
      if (status === 'streaming') {
        const newDocument = buildDocumentFromContent(content);

        const transaction = editorRef.current.state.tr.replaceWith(
          0,
          editorRef.current.state.doc.content.size,
          newDocument.content,
        );

        // Prevent save loop with metadata flag
        transaction.setMeta('no-save', true);
        editorRef.current.dispatch(transaction);
        return;
      }

      // Only update if content has actually changed
      if (currentContent !== content) {
        const newDocument = buildDocumentFromContent(content);

        const transaction = editorRef.current.state.tr.replaceWith(
          0,
          editorRef.current.state.doc.content.size,
          newDocument.content,
        );

        // Prevent save loop with metadata flag
        transaction.setMeta('no-save', true);
        editorRef.current.dispatch(transaction);
      }
    }
  }, [content, status]);

  /**
   * Handle suggestions display in the editor
   * Projects suggestions to document positions and adds decorations
   */
  useEffect(() => {
    if (editorRef.current?.state.doc && content) {
      // Map suggestions to document positions
      const projectedSuggestions = projectWithPositions(
        editorRef.current.state.doc,
        suggestions,
      ).filter(
        (suggestion) => suggestion.selectionStart && suggestion.selectionEnd,
      );

      // Create visual decorations for the suggestions
      const decorations = createDecorations(
        projectedSuggestions,
        editorRef.current,
      );

      // Apply decorations to the editor view
      const transaction = editorRef.current.state.tr;
      transaction.setMeta(suggestionsPluginKey, { decorations });
      editorRef.current.dispatch(transaction);
    }
  }, [suggestions, content]);

  return (
    <div className="relative prose dark:prose-invert" ref={containerRef} />
  );
}

/**
 * Custom equality function for memoizing the editor component
 * Prevents unnecessary re-renders when props haven't meaningfully changed
 */
function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  return (
    prevProps.suggestions === nextProps.suggestions &&
    prevProps.currentVersionIndex === nextProps.currentVersionIndex &&
    prevProps.isCurrentVersion === nextProps.isCurrentVersion &&
    !(prevProps.status === 'streaming' && nextProps.status === 'streaming') &&
    prevProps.content === nextProps.content &&
    prevProps.onSaveContent === nextProps.onSaveContent
  );
}

// Export memoized component to prevent unnecessary re-renders
export const Editor = memo(PureEditor, areEqual);
