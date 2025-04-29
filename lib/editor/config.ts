/**
 * Editor Configuration
 *
 * This file provides configuration and utilities for the ProseMirror editor.
 * It defines the editor schema, input rules, and transaction handling.
 *
 * Features:
 * - Custom document schema definition
 * - Input rules for markdown-like editing
 * - Transaction handling for content changes
 * - Save content management
 *
 * The editor configuration enables rich text editing capabilities with
 * markdown support and automatic content saving.
 */

import { textblockTypeInputRule } from 'prosemirror-inputrules';
import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import type { Transaction } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import type { MutableRefObject } from 'react';

import { buildContentFromDocument } from './functions';

/**
 * Custom schema for the document editor
 * Extends the basic schema with list support
 */
export const documentSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

/**
 * Creates an input rule for heading markdown syntax
 * Allows users to type "#" followed by space to create headings
 *
 * @param level - Heading level (1-6)
 * @returns Input rule that converts markdown syntax to heading nodes
 */
export function headingRule(level: number) {
  return textblockTypeInputRule(
    new RegExp(`^(#{1,${level}})\\s$`),
    documentSchema.nodes.heading,
    () => ({ level }),
  );
}

/**
 * Handles editor transactions
 * Process changes to the editor state and saves content when appropriate
 *
 * @param transaction - The transaction to process
 * @param editorRef - Reference to the editor view
 * @param onSaveContent - Callback to save content changes
 */
export const handleTransaction = ({
  transaction,
  editorRef,
  onSaveContent,
}: {
  transaction: Transaction;
  editorRef: MutableRefObject<EditorView | null>;
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
}) => {
  if (!editorRef || !editorRef.current) return;

  // Apply the transaction to get the new editor state
  const newState = editorRef.current.state.apply(transaction);
  editorRef.current.updateState(newState);

  // If the document changed and it's not marked as no-save, save the content
  if (transaction.docChanged && !transaction.getMeta('no-save')) {
    const updatedContent = buildContentFromDocument(newState.doc);

    // Check if we should debounce the save or save immediately
    if (transaction.getMeta('no-debounce')) {
      onSaveContent(updatedContent, false);
    } else {
      onSaveContent(updatedContent, true);
    }
  }
};
