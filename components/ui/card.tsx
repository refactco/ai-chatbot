/**
 * Card Component
 *
 * This component provides a container for displaying content in a card format.
 * It includes multiple subcomponents for structured content organization.
 *
 * Features:
 * - Consistent card styling with shadows and borders
 * - Structured content layout with header, content, and footer
 * - Semantic title and description components
 * - Consistent spacing and typography
 * - Composable structure for flexible content organization
 *
 * Used throughout the application for displaying grouped content,
 * settings panels, summaries, and interactive elements.
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Main card container component
 * Provides the outer wrapper with styling for the card
 *
 * @param props - Standard div properties including optional className
 * @returns Styled card container element
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

/**
 * Card header component
 * Container for card title and description
 *
 * @param props - Standard div properties including optional className
 * @returns Styled header section for the card
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/**
 * Card title component
 * Displays the main heading for the card
 *
 * @param props - Standard div properties including optional className
 * @returns Styled title element for the card
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/**
 * Card description component
 * Displays supporting text below the title
 *
 * @param props - Standard div properties including optional className
 * @returns Styled description element for the card
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/**
 * Card content component
 * Container for the main content of the card
 *
 * @param props - Standard div properties including optional className
 * @returns Styled content container for the card
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/**
 * Card footer component
 * Container for actions or supplementary content at the bottom of the card
 *
 * @param props - Standard div properties including optional className
 * @returns Styled footer section for the card
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
