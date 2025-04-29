/**
 * Mobile Detection Hook
 *
 * This hook detects whether the current device is a mobile device
 * based on screen width, and responds to viewport size changes.
 *
 * Features:
 * - Responsive detection of mobile devices
 * - Window resize event handling
 * - Media query integration
 * - Clean event listener management
 *
 * Used throughout the application to adapt the UI for mobile devices
 * and ensure a responsive user experience across different screen sizes.
 */

import * as React from 'react';

/**
 * Breakpoint value in pixels that defines the threshold for mobile devices
 * Viewport widths below this value are considered mobile
 */
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized
 *
 * @returns boolean indicating whether the current viewport is mobile-sized
 * Returns true for screens narrower than MOBILE_BREAKPOINT
 */
export function useIsMobile() {
  // Initialize state as undefined to avoid hydration mismatch
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Set up media query listener for responsive detection
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Handler function to update state when viewport size changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener and set initial value
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Clean up event listener on component unmount
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Force boolean return type even when state is undefined
  return !!isMobile;
}
