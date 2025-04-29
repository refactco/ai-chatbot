/**
 * Toast Component
 *
 * This component provides customized toast notifications throughout the application.
 * Features:
 * - Type-based styling (success/error)
 * - Distinctive icons for different notification types
 * - Responsive layout for both mobile and desktop
 * - Sonner toast library integration for animations
 * - Accessibility considerations with semantic elements
 * - Consistent application styling
 *
 * Toasts provide non-intrusive feedback for user actions like successful
 * operations or errors, appearing briefly before automatically dismissing.
 */

'use client';

import type { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircleFillIcon, WarningIcon } from './icons';

/**
 * Icon mapping for different toast types
 * Maps toast types to their corresponding icon components
 */
const iconsByType: Record<'success' | 'error', ReactNode> = {
  success: <CheckCircleFillIcon />,
  error: <WarningIcon />,
};

/**
 * Primary toast function to display notifications
 * @param props - Toast configuration without ID (added by sonner)
 * @returns A toast instance
 */
export function toast(props: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <Toast id={id} type={props.type} description={props.description} />
  ));
}

/**
 * Internal Toast component that renders the actual notification
 * @param props - Complete toast properties including ID
 */
function Toast(props: ToastProps) {
  const { id, type, description } = props;

  return (
    <div className="flex w-full toast-mobile:w-[356px] justify-center">
      <div
        data-testid="toast"
        key={id}
        className="bg-zinc-100 p-3 rounded-lg w-full toast-mobile:w-fit flex flex-row gap-2 items-center"
      >
        {/* Type-specific colored icon */}
        <div
          data-type={type}
          className="data-[type=error]:text-red-600 data-[type=success]:text-green-600"
        >
          {iconsByType[type]}
        </div>
        {/* Toast message content */}
        <div className="text-zinc-950 text-sm">{description}</div>
      </div>
    </div>
  );
}

/**
 * Props interface for Toast component
 * @property id - Unique identifier for the toast (added by sonner)
 * @property type - Type of toast determining styling and icon
 * @property description - Message content to display
 */
interface ToastProps {
  id: string | number;
  type: 'success' | 'error';
  description: string;
}
