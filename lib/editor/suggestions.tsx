/**
 * Editor Suggestion System
 *
 * This file implements a suggestion system for the ProseMirror editor.
 * It provides functionality to display and manage text improvement suggestions.
 *
 * Features:
 * - Suggestion positioning and placement
 * - Text search and highlighting
 * - Suggestion widget rendering
 * - React integration with ProseMirror
 * - Suggestion application handling
 *
 * The suggestion system enables interactive text improvements with preview
 * and one-click application of suggested changes.
 */

import type { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import {
  type Decoration,
  DecorationSet,
  type EditorView,
} from 'prosemirror-view';
import { createRoot } from 'react-dom/client';

import { Suggestion as PreviewSuggestion } from '@/components/suggestion';
import type { Suggestion } from '@/lib/schema';
import type { ArtifactKind } from '@/components/artifact';

/**
 * Extended suggestion type with UI-specific positioning
 * Adds selection position information to base suggestion type
 */
export interface UISuggestion extends Suggestion {
  id: string; // Unique identifier
  description: string; // Suggestion description
  selectionStart: number; // Start position in document
  selectionEnd: number; // End position in document
}

/**
 * Internal position type for tracking text locations
 */
interface Position {
  start: number; // Start position in document
  end: number; // End position in document
}

/**
 * Finds the position of text within a document
 * Searches through nodes to locate specific text content
 *
 * @param doc - ProseMirror document to search in
 * @param searchText - Text to search for
 * @returns Position object or null if not found
 */
function findPositionsInDoc(doc: Node, searchText: string): Position | null {
  let positions: { start: number; end: number } | null = null;

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (node.isText && node.text) {
      const index = node.text.indexOf(searchText);

      if (index !== -1) {
        positions = {
          start: pos + index,
          end: pos + index + searchText.length,
        };

        return false;
      }
    }

    return true;
  });

  return positions;
}

/**
 * Projects base suggestions to UI suggestions with position information
 * Maps suggestions to include document position coordinates
 *
 * @param doc - ProseMirror document to position suggestions in
 * @param suggestions - Array of base suggestions
 * @returns Array of UI suggestions with position information
 */
export function projectWithPositions(
  doc: Node,
  suggestions: Array<Suggestion>,
): Array<UISuggestion> {
  return suggestions.map((suggestion) => {
    const positions = findPositionsInDoc(doc, suggestion.originalText);

    if (!positions) {
      return {
        ...suggestion,
        description: suggestion.content || suggestion.suggestedText || '',
        selectionStart: 0,
        selectionEnd: 0,
      };
    }

    return {
      ...suggestion,
      description: suggestion.content || suggestion.suggestedText || '',
      selectionStart: positions.start,
      selectionEnd: positions.end,
    };
  });
}

/**
 * Creates a React widget for a suggestion in the editor
 * Renders the suggestion UI and wires up event handling
 *
 * @param suggestion - The suggestion to render
 * @param view - The editor view to integrate with
 * @param artifactKind - Type of artifact being edited
 * @returns DOM element and cleanup function
 */
export function createSuggestionWidget(
  suggestion: UISuggestion,
  view: EditorView,
  artifactKind: ArtifactKind = 'text',
): { dom: HTMLElement; destroy: () => void } {
  const dom = document.createElement('span');
  const root = createRoot(dom);

  // Prevent editor focusing when suggestion is clicked
  dom.addEventListener('mousedown', (event) => {
    event.preventDefault();
    view.dom.blur();
  });

  /**
   * Handles applying a suggestion
   * Updates the document by replacing original text with suggested text
   */
  const onApply = () => {
    const { state, dispatch } = view;

    // Remove decorations for this suggestion
    const decorationTransaction = state.tr;
    const currentState = suggestionsPluginKey.getState(state);
    const currentDecorations = currentState?.decorations;

    if (currentDecorations) {
      const newDecorations = DecorationSet.create(
        state.doc,
        currentDecorations.find().filter((decoration: Decoration) => {
          return decoration.spec.suggestionId !== suggestion.id;
        }),
      );

      decorationTransaction.setMeta(suggestionsPluginKey, {
        decorations: newDecorations,
        selected: null,
      });
      dispatch(decorationTransaction);
    }

    // Replace the original text with suggested text
    const textTransaction = view.state.tr.replaceWith(
      suggestion.selectionStart,
      suggestion.selectionEnd,
      state.schema.text(suggestion.suggestedText),
    );

    // Ensure this edit is applied immediately (no debouncing)
    textTransaction.setMeta('no-debounce', true);

    dispatch(textTransaction);
  };

  // Render the suggestion UI component
  root.render(
    <PreviewSuggestion
      suggestion={suggestion}
      onApply={onApply}
      artifactKind={artifactKind}
    />,
  );

  return {
    dom,
    destroy: () => {
      // Wrapping unmount in setTimeout to avoid synchronous unmounting during render
      setTimeout(() => {
        root.unmount();
      }, 0);
    },
  };
}

/**
 * Plugin key for the suggestions plugin
 * Used to access suggestion state from the editor
 */
export const suggestionsPluginKey = new PluginKey('suggestions');

/**
 * ProseMirror plugin for managing suggestions
 * Handles suggestion state and decoration rendering
 */
export const suggestionsPlugin = new Plugin({
  key: suggestionsPluginKey,
  state: {
    init() {
      return { decorations: DecorationSet.empty, selected: null };
    },
    apply(tr, state) {
      const newDecorations = tr.getMeta(suggestionsPluginKey);
      if (newDecorations) return newDecorations;

      return {
        decorations: state.decorations.map(tr.mapping, tr.doc),
        selected: state.selected,
      };
    },
  },
  props: {
    decorations(state) {
      return this.getState(state)?.decorations ?? DecorationSet.empty;
    },
  },
});
