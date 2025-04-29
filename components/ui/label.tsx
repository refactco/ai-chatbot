/**
 * Label Component
 *
 * This component provides an accessible label for form controls.
 * It extends Radix UI's Label primitive with consistent styling.
 *
 * Features:
 * - Accessibility-first implementation
 * - Consistent styling with form elements
 * - Support for disabled states
 * - Text size and spacing consistency
 * - Proper focus management
 *
 * Used to provide context and improve usability for input fields,
 * checkboxes, radio buttons, and other form elements.
 */

'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Styling variants for the label component
 */
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

/**
 * Label component for form controls
 * Associates with form elements using htmlFor or by wrapping the control
 *
 * @param props - Component properties including className and standard label attributes
 * @returns Accessible label component with consistent styling
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
