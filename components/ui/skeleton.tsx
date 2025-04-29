/**
 * Skeleton Component
 *
 * This component provides loading placeholders for content.
 * It displays animated areas representing content being loaded.
 *
 * Features:
 * - Pulse animation for loading indication
 * - Customizable dimensions and shape
 * - Consistent styling with the design system
 * - Visual feedback for loading states
 * - Simple implementation for various content types
 *
 * Used throughout the application to improve perceived performance
 * by showing placeholder content while actual data is loading.
 */

import { cn } from '@/lib/utils';

/**
 * Skeleton component for loading states
 * Creates an animated placeholder for content that is loading
 *
 * @param props - Component properties including className for customizing dimensions
 * @returns Animated skeleton element with appropriate styling
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export { Skeleton };
