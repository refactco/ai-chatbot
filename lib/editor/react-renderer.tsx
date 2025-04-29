/**
 * React ProseMirror Renderer
 *
 * This file provides a React-based renderer for ProseMirror content.
 * It enables rendering ProseMirror documents directly in React components.
 * 
 * Features:
 * - React integration for ProseMirror
 * - Server-side rendering support
 * - Markdown content rendering
 * - Clean interface between React and ProseMirror
 * 
 * This renderer serves as a bridge between the ProseMirror editor system
 * and React's component-based UI system.
 */

'use client';

import { createRoot } from 'react-dom/client';
import { Markdown } from '@/components/markdown';
import { buildContentFromDocument } from './functions';
import type { Node } from 'prosemirror-model';

/**
 * Renders a ProseMirror document node as React component
 * Converts the document to markdown then renders with Markdown component
 * 
 * @param doc - ProseMirror document node to render
 * @returns React element with rendered content
 */
export const renderNodeAsReact = (doc: Node) => {
  const content = buildContentFromDocument(doc);
  return <Markdown>{content}</Markdown>;
};

/**
 * Utility class for rendering React components in the ProseMirror context
 * Provides a clean interface for mounting and unmounting React elements
 */
export class ReactRenderer {
  /**
   * Renders a React component into a DOM element
   * Creates a React root and renders the component
   * 
   * @param component - React element to render
   * @param dom - DOM element to render into
   * @returns Object with destroy method for cleanup
   */
  static render(component: React.ReactElement, dom: HTMLElement) {
    const root = createRoot(dom);
    root.render(component);

    return {
      destroy: () => root.unmount(),
    };
  }
}
