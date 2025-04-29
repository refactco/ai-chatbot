/**
 * Editor Utility Functions
 *
 * This file provides utility functions for the ProseMirror-based editor.
 * It handles document conversion, suggestion management, and decoration creation.
 *
 * Features:
 * - Markdown to document node conversion
 * - Document node to markdown conversion
 * - Suggestion decoration generation
 * - DOM element generation for React components
 *
 * These utilities connect React components with the ProseMirror editor
 * and enable rich editing features like suggestions and decorations.
 */

'use client';

import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import { DOMParser, type Node } from 'prosemirror-model';
import { Decoration, DecorationSet, type EditorView } from 'prosemirror-view';
import { renderToString } from 'react-dom/server';

import { Markdown } from '@/components/markdown';

import { documentSchema } from './config';
import { createSuggestionWidget, type UISuggestion } from './suggestions';

/**
 * Builds a ProseMirror document from markdown content
 * Converts markdown string to ProseMirror document structure
 *
 * @param content - Markdown content string
 * @returns ProseMirror document node
 */
export const buildDocumentFromContent = (content: string) => {
  const parser = DOMParser.fromSchema(documentSchema);
  const stringFromMarkdown = renderToString(<Markdown>{content}</Markdown>);
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = stringFromMarkdown;
  return parser.parse(tempContainer);
};

/**
 * Builds markdown content from a ProseMirror document
 * Converts document structure back to markdown string
 *
 * @param document - ProseMirror document node
 * @returns Markdown content string
 */
export const buildContentFromDocument = (document: Node) => {
  return defaultMarkdownSerializer.serialize(document);
};

/**
 * Creates decorations for suggestions in the editor
 * Generates both highlight decorations and widget decorations
 *
 * @param suggestions - Array of suggestions to display
 * @param view - The editor view to create decorations for
 * @returns DecorationSet containing all suggestion decorations
 */
export const createDecorations = (
  suggestions: Array<UISuggestion>,
  view: EditorView,
) => {
  const decorations: Array<Decoration> = [];

  for (const suggestion of suggestions) {
    // Create highlight decoration for the suggested text
    decorations.push(
      Decoration.inline(
        suggestion.selectionStart,
        suggestion.selectionEnd,
        {
          class: 'suggestion-highlight',
        },
        {
          suggestionId: suggestion.id,
          type: 'highlight',
        },
      ),
    );

    // Create widget decoration to display UI for suggestion
    decorations.push(
      Decoration.widget(
        suggestion.selectionStart,
        (view) => {
          const { dom } = createSuggestionWidget(suggestion, view);
          return dom;
        },
        {
          suggestionId: suggestion.id,
          type: 'widget',
        },
      ),
    );
  }

  return DecorationSet.create(view.state.doc, decorations);
};
