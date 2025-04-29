/**
 * Input Component
 *
 * This component provides a styled input field with consistent styling.
 * It extends the native input element with appropriate visual design.
 *
 * Features:
 * - Consistent styling with the design system
 * - Support for all HTML input types
 * - Proper focus states
 * - File input styling
 * - Accessibility support
 *
 * Used throughout the application for text entry, search fields,
 * and other single-line input requirements.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Extended input component with consistent styling
 *
 * @param props - Standard input attributes plus optional className
 * @returns Styled input component
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
