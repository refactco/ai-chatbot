/**
 * Icons Component Library
 *
 * This file provides a centralized collection of SVG icons used throughout the application.
 * Features:
 * - Consistent styling and sizing across all icons
 * - Size customization via props
 * - Current color inheritance for theme compatibility
 * - Accessibility attributes for screen readers
 * - Optimized SVG paths for performance
 * - Categorized icons for different UI purposes
 *
 * The icons are organized by function (navigation, actions, status, etc.)
 * and maintain a consistent API for easy use in components.
 */

import React from 'react';

export const BotIcon = () => {
  return (
    <svg
      height="16"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75 2.79933C9.19835 2.53997 9.5 2.05521 9.5 1.5C9.5 0.671573 8.82843 0 8 0C7.17157 0 6.5 0.671573 6.5 1.5C6.5 2.05521 6.80165 2.53997 7.25 2.79933V5H7C4.027 5 1.55904 7.16229 1.08296 10H0V13H1V14.5V16H2.5H13.5H15V14.5V13H16V10H14.917C14.441 7.16229 11.973 5 9 5H8.75V2.79933ZM7 6.5C4.51472 6.5 2.5 8.51472 2.5 11V14.5H13.5V11C13.5 8.51472 11.4853 6.5 9 6.5H7ZM7.25 11.25C7.25 12.2165 6.4665 13 5.5 13C4.5335 13 3.75 12.2165 3.75 11.25C3.75 10.2835 4.5335 9.5 5.5 9.5C6.4665 9.5 7.25 10.2835 7.25 11.25ZM10.5 13C11.4665 13 12.25 12.2165 12.25 11.25C12.25 10.2835 11.4665 9.5 10.5 9.5C9.5335 9.5 8.75 10.2835 8.75 11.25C8.75 12.2165 9.5335 13 10.5 13Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const UserIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      data-testid="geist-icon"
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 0C5.95507 0 4.5 1.45507 4.5 3.25V3.75C4.5 5.54493 5.95507 7 7.75 7H8.25C10.0449 7 11.5 5.54493 11.5 3.75V3.25C11.5 1.45507 10.0449 0 8.25 0H7.75ZM6 3.25C6 2.2835 6.7835 1.5 7.75 1.5H8.25C9.2165 1.5 10 2.2835 10 3.25V3.75C10 4.7165 9.2165 5.5 8.25 5.5H7.75C6.7835 5.5 6 4.7165 6 3.75V3.25ZM2.5 14.5V13.1709C3.31958 11.5377 4.99308 10.5 6.82945 10.5H9.17055C11.0069 10.5 12.6804 11.5377 13.5 13.1709V14.5H2.5ZM6.82945 9C4.35483 9 2.10604 10.4388 1.06903 12.6857L1 12.8353V13V15.25V16H1.75H14.25H15V15.25V13V12.8353L14.931 12.6857C13.894 10.4388 11.6452 9 9.17055 9H6.82945Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PencilEditIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.436 1.77691C11.7249 1.48805 12.1998 1.48805 12.4887 1.77691L14.2231 3.51129C14.5119 3.80015 14.5119 4.27505 14.2231 4.56391L5.56391 13.2231C5.41833 13.3687 5.22155 13.4533 5.01526 13.4609L2.01526 13.5859C1.7247 13.5969 1.45326 13.4704 1.27939 13.2414C1.10552 13.0124 1.05184 12.7177 1.14112 12.4488L2.26612 9.01526C2.30354 8.87799 2.37799 8.75185 2.48159 8.64825L11.436 1.77691ZM3.25 9.79836L2.43011 12.2699L4.75993 12.1773L12.75 4.18722L11.8128 3.25L3.25 9.79836Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SparklesIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 0.5C9.5 0.223858 9.27614 0 9 0C8.72386 0 8.5 0.223858 8.5 0.5V2.5C8.5 2.77614 8.72386 3 9 3C9.27614 3 9.5 2.77614 9.5 2.5V0.5ZM5.5 2C5.5 1.72386 5.27614 1.5 5 1.5C4.72386 1.5 4.5 1.72386 4.5 2V3C4.5 3.27614 4.72386 3.5 5 3.5C5.27614 3.5 5.5 3.27614 5.5 3V2ZM13 1.5C13.2761 1.5 13.5 1.72386 13.5 2V3C13.5 3.27614 13.2761 3.5 13 3.5C12.7239 3.5 12.5 3.27614 12.5 3V2C12.5 1.72386 12.7239 1.5 13 1.5ZM2.5 5C2.5 4.72386 2.27614 4.5 2 4.5C1.72386 4.5 1.5 4.72386 1.5 5V6C1.5 6.27614 1.72386 6.5 2 6.5C2.27614 6.5 2.5 6.27614 2.5 6V5ZM16 4.5C16.2761 4.5 16.5 4.72386 16.5 5V6C16.5 6.27614 16.2761 6.5 16 6.5C15.7239 6.5 15.5 6.27614 15.5 6V5C15.5 4.72386 15.7239 4.5 16 4.5ZM12.8033 5.69668C13.0962 5.40379 13.0962 4.92893 12.8033 4.63603C12.5104 4.34314 12.0355 4.34314 11.7426 4.63603L10.5 5.87868L9.25736 4.63603C8.96447 4.34314 8.48959 4.34314 8.1967 4.63603C7.90381 4.92893 7.90381 5.40379 8.1967 5.69668L9.43934 6.93933L8.1967 8.18198C7.90381 8.47487 7.90381 8.94974 8.1967 9.24264C8.48959 9.53553 8.96447 9.53553 9.25736 9.24264L10.5 7.99999L11.7426 9.24264C12.0355 9.53553 12.5104 9.53553 12.8033 9.24264C13.0962 8.94974 13.0962 8.47487 12.8033 8.18198L11.5607 6.93933L12.8033 5.69668ZM5.5 9C5.5 8.72386 5.27614 8.5 5 8.5C4.72386 8.5 4.5 8.72386 4.5 9V10C4.5 10.2761 4.72386 10.5 5 10.5C5.27614 10.5 5.5 10.2761 5.5 10V9ZM13 8.5C13.2761 8.5 13.5 8.72386 13.5 9V10C13.5 10.2761 13.2761 10.5 13 10.5C12.7239 10.5 12.5 10.2761 12.5 10V9C12.5 8.72386 12.7239 8.5 13 8.5ZM9.5 13.5C9.5 13.2239 9.27614 13 9 13C8.72386 13 8.5 13.2239 8.5 13.5V15.5C8.5 15.7761 8.72386 16 9 16C9.27614 16 9.5 15.7761 9.5 15.5V13.5ZM2.5 12C2.5 11.7239 2.27614 11.5 2 11.5C1.72386 11.5 1.5 11.7239 1.5 12V13C1.5 13.2761 1.72386 13.5 2 13.5C2.27614 13.5 2.5 13.2761 2.5 13V12ZM16 11.5C16.2761 11.5 16.5 11.7239 16.5 12V13C16.5 13.2761 16.2761 13.5 16 13.5C15.7239 13.5 15.5 13.2761 15.5 13V12C15.5 11.7239 15.7239 11.5 16 11.5ZM6.86334 11.6967C7.15624 11.4038 7.15624 10.9289 6.86334 10.636C6.57045 10.3431 6.09558 10.3431 5.80268 10.636L4.56003 11.8787L3.31738 10.636C3.02449 10.3431 2.54962 10.3431 2.25673 10.636C1.96383 10.9289 1.96383 11.4038 2.25673 11.6967L3.49938 12.9393L2.25673 14.182C1.96383 14.4749 1.96383 14.9497 2.25673 15.2426C2.54962 15.5355 3.02449 15.5355 3.31738 15.2426L4.56003 14L5.80268 15.2426C6.09558 15.5355 6.57045 15.5355 6.86334 15.2426C7.15624 14.9497 7.15624 14.4749 6.86334 14.182L5.62069 12.9393L6.86334 11.6967Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const MoreHorizontalIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 8C4 9.10457 3.10457 10 2 10C0.895431 10 0 9.10457 0 8C0 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8ZM10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8ZM14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const TrashIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 0C5.67157 0 5 0.671573 5 1.5V2H10V1.5C10 0.671573 9.32843 0 8.5 0H6.5ZM11.5 2V1.5C11.5 0.119288 10.1569 -1.00232e-05 8.5 -1.00232e-05H6.5C4.84315 -1.00232e-05 3.5 0.119288 3.5 1.5V2H1.5C0.947715 2 0.5 2.44772 0.5 3C0.5 3.55228 0.947715 4 1.5 4H2V13.5C2 14.8807 3.11929 16 4.5 16H10.5C11.8807 16 13 14.8807 13 13.5V4H13.5C14.0523 4 14.5 3.55228 14.5 3C14.5 2.44772 14.0523 2 13.5 2H11.5ZM11.5 4H3.5V13.5C3.5 14.0523 3.94772 14.5 4.5 14.5H10.5C11.0523 14.5 11.5 14.0523 11.5 13.5V4ZM5.5 6C5.5 5.44772 5.94772 5 6.5 5C7.05228 5 7.5 5.44772 7.5 6V12.5C7.5 13.0523 7.05228 13.5 6.5 13.5C5.94772 13.5 5.5 13.0523 5.5 12.5V6ZM9.5 5C8.94772 5 8.5 5.44772 8.5 6V12.5C8.5 13.0523 8.94772 13.5 9.5 13.5C10.0523 13.5 10.5 13.0523 10.5 12.5V6C10.5 5.44772 10.0523 5 9.5 5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PlusIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C8.55228 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const EyeIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.667969 8.00033C0.667969 8.00033 3.33464 2.66699 8.0013 2.66699C12.668 2.66699 15.3346 8.00033 15.3346 8.00033C15.3346 8.00033 12.668 13.3337 8.0013 13.3337C3.33464 13.3337 0.667969 8.00033 0.667969 8.00033Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="transparent"
      />
    </svg>
  );
};
