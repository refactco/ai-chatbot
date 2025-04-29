/**
 * Separator Component
 *
 * This component provides visual separation between content sections.
 * It extends Radix UI's Separator primitive with consistent styling.
 *
 * Features:
 * - Horizontal or vertical orientation
 * - Consistent styling with the design system
 * - Accessible implementation with proper ARIA attributes
 * - Support for decorative and semantic separators
 * - Customizable appearance
 *
 * Used throughout the application to visually separate different
 * sections of content and improve visual hierarchy.
 */

'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

/**
 * Separator component for visual content division
 *
 * @param props - Component properties including orientation and decorative flag
 * @param props.orientation - Direction of the separator ('horizontal' or 'vertical')
 * @param props.decorative - Whether separator is purely visual or has semantic meaning
 * @returns Styled separator with appropriate ARIA attributes
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
