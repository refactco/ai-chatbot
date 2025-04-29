/**
 * Textarea Component
 *
 * This component provides a styled textarea input for multi-line text entry.
 * It extends the native textarea with consistent styling and accessibility features.
 *
 * Features:
 * - Consistent styling with the design system
 * - Proper focus states
 * - Accessibility support
 * - Custom class name support
 *
 * Used throughout the application for comment fields, message inputs,
 * and other multi-line text entry scenarios.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Extended textarea component with consistent styling
 *
 * @param props - Standard textarea attributes plus optional className
 * @returns Styled textarea component
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
