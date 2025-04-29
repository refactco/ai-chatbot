/**
 * DiffView Component
 *
 * This component provides a visual representation of differences between document versions.
 * It highlights insertions, deletions, and unchanged content for comparison.
 *
 * Features:
 * - Visual diff highlighting with color coding
 * - Support for rich text documents
 * - Integration with ProseMirror document model
 * - Style customization for different diff types
 * - Readonly mode for viewing-only scenarios
 *
 * This component is used in the version history feature to show
 * what has changed between document revisions.
 */

'use client';

import { diffEditor, DiffType } from '@/lib/editor/diff';
import { PencilEditIcon, EyeIcon } from '@/components/icons';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { buildDocumentFromContent } from '@/lib/editor/functions';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { Mark } from 'prosemirror-model';

/**
 * Creates a schema for the ProseMirror editor with diff mark support
 *
 * @returns ProseMirror schema with diffMark type
 */
const getDiffSchema = () => {
  const diffSchema = schema;

  // Add a mark for diffing
  diffSchema.spec.marks = diffSchema.spec.marks.addToEnd('diffMark', {
    attrs: {
      type: { default: 0 },
    },
    toDOM(mark: Mark) {
      const { type } = mark.attrs;

      // Apply different styling based on diff type
      if (type === DiffType.Inserted) {
        return [
          'span',
          {
            class: 'diff-inserted',
            style:
              'background-color: rgba(0, 255, 0, 0.2); text-decoration: none;',
          },
          0,
        ];
      }

      if (type === DiffType.Deleted) {
        return [
          'span',
          {
            class: 'diff-deleted',
            style:
              'background-color: rgba(255, 0, 0, 0.2); text-decoration: line-through;',
          },
          0,
        ];
      }

      return ['span', { class: 'diff-unchanged' }, 0];
    },
  });

  return diffSchema;
};

/**
 * DiffView component that renders visual diffs between two document versions
 *
 * @param props - Component properties with old and new content
 * @returns Visual diff viewer with edit/view controls
 */
function PureDiffView({
  oldContent,
  newContent,
  isReadonly = false,
}: {
  oldContent: string;
  newContent: string;
  isReadonly?: boolean;
}) {
  const [mode, setMode] = useState<'diff' | 'view'>('diff');
  const viewRef = useRef<HTMLDivElement>(null);

  /**
   * Creates the ProseMirror editor view with diff highlighting
   */
  const createEditorView = useCallback(() => {
    if (!viewRef.current) return;

    // Clear any existing content
    viewRef.current.innerHTML = '';

    // Get our schema with diff mark support
    const schema = getDiffSchema();

    try {
      // Convert content to ProseMirror nodes
      const oldDoc = buildDocumentFromContent(oldContent);
      const newDoc = buildDocumentFromContent(newContent);

      // Generate diff between old and new documents
      const diffDoc = diffEditor(schema, oldDoc.toJSON(), newDoc.toJSON());

      // Create editor state with the diff document
      const state = EditorState.create({
        doc: diffDoc,
      });

      // Create the editor view (readonly)
      new EditorView(viewRef.current, {
        state,
        editable: () => false,
      });
    } catch (error) {
      console.error('Error creating diff view', error);
      viewRef.current.innerHTML = '<div>Error displaying diff</div>';
    }
  }, [oldContent, newContent]);

  // Create the editor view when content or mode changes
  useEffect(() => {
    if (mode === 'diff') {
      createEditorView();
    } else {
      if (viewRef.current) {
        viewRef.current.innerHTML = '';
        const contentToShow = `<div style="white-space: pre-wrap;">${newContent}</div>`;
        viewRef.current.innerHTML = contentToShow;
      }
    }
  }, [mode, createEditorView, newContent]);

  return (
    <div className="relative border rounded-md">
      {!isReadonly && (
        <div className="absolute right-2 top-2 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full size-8 p-0"
                onClick={() => setMode(mode === 'diff' ? 'view' : 'diff')}
              >
                {mode === 'diff' ? <EyeIcon /> : <PencilEditIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {mode === 'diff' ? 'View content only' : 'View differences'}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="p-4 prose prose-sm max-w-none" ref={viewRef} />
    </div>
  );
}

export const DiffView = memo(PureDiffView);
