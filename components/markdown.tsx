/**
 * Markdown Component
 *
 * This component renders markdown content with custom styling and components.
 * It provides consistent rendering of markdown throughout the application.
 *
 * Features:
 * - Custom styling for all markdown elements
 * - Support for GitHub Flavored Markdown
 * - Memoization for performance optimization
 * - Consistent heading hierarchy and styling
 * - Custom link handling with proper attributes
 *
 * This component serves as the central rendering utility for all
 * text content that requires markdown formatting.
 */

import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Custom component mappings for markdown elements
 * Provides consistent styling throughout the application
 */
const components: Partial<Components> = {
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  p: ({ node, children, ...props }) => {
    return (
      <p className="mb-4 last:mb-0" {...props}>
        {children}
      </p>
    );
  },
  pre: ({ node, children, ...props }) => {
    return (
      <pre
        className="bg-muted px-4 py-3 rounded-md my-2 overflow-x-auto text-sm font-mono"
        {...props}
      >
        {children}
      </pre>
    );
  },
  code: ({ node, inline, className, children, ...props }: any) => {
    return inline ? (
      <code
        className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className={`${className || ''} text-sm font-mono`} {...props}>
        {children}
      </code>
    );
  },
  blockquote: ({ node, children, ...props }) => {
    return (
      <blockquote
        className="pl-4 border-l-2 border-muted-foreground italic text-muted-foreground my-4"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  hr: ({ node, ...props }) => {
    return <hr className="my-4 border-muted" {...props} />;
  },
  table: ({ node, children, ...props }) => {
    return (
      <div className="my-4 overflow-x-auto">
        <table
          className="w-full border-collapse border border-border"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  th: ({ node, children, ...props }) => {
    return (
      <th
        className="border border-border bg-background px-4 py-2 text-left font-medium"
        {...props}
      >
        {children}
      </th>
    );
  },
  td: ({ node, children, ...props }) => {
    return (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    );
  },
};

/**
 * Remark plugins for enhanced markdown support
 */
const remarkPlugins = [remarkGfm];

/**
 * Non-memoized markdown component
 * Renders markdown content using react-markdown with custom styling
 */
function NonMemoizedMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}

/**
 * Memoized markdown component for performance optimization
 * Only re-renders when the markdown content changes
 */
export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
