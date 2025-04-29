/**
 * Submit Button Component
 *
 * This component provides an enhanced submit button for forms with built-in loading states.
 * Features:
 * - Visual loading state with animated spinner
 * - Automatic disabling during submission to prevent duplicate submissions
 * - Accessibility support with aria attributes
 * - Screen reader announcements for state changes
 * - Consistent styling based on application design system
 *
 * Used in form components throughout the application to provide a consistent
 * and accessible submission experience.
 */

'use client';

import { useFormStatus } from 'react-dom';

import { LoaderIcon } from '@/components/icons';

import { Button } from './ui/button';

/**
 * Props for the SubmitButton component
 * @property children - Button label content
 * @property isSuccessful - Whether the submission was successful
 */
export function SubmitButton({
  children,
  isSuccessful,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
}) {
  // Get form submission state from React's useFormStatus hook
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? 'button' : 'submit'} // Prevent double submission during pending state
      aria-disabled={pending || isSuccessful} // Accessibility attribute for disabled state
      disabled={pending || isSuccessful} // Visual and functional disabling
      className="relative" // Position relative for absolute spinner positioning
    >
      {children}

      {/* Animated loading spinner shown during pending or successful states */}
      {(pending || isSuccessful) && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}

      {/* Screen reader announcement for accessibility */}
      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? 'Loading' : 'Submit form'}
      </output>
    </Button>
  );
}
