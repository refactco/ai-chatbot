/**
 * Scroll to Bottom Hook
 *
 * This custom React hook provides automatic scrolling functionality for chat interfaces.
 * Features:
 * - Automatically scrolls to the bottom when content changes
 * - Uses MutationObserver for efficient DOM change detection
 * - Returns refs to attach to container and end elements
 * - Cleans up observer on component unmount
 * - Typesafe implementation with generic type parameter
 *
 * Useful for chat interfaces, message lists, and any container where
 * new content should keep the view scrolled to the bottom automatically.
 */

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hook that automatically scrolls a container to its bottom when content changes
 * @returns Tuple containing [containerRef, endRef] to be attached to elements
 * @template T - HTML element type, defaults to HTMLElement
 */
export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  // Reference to the scrollable container element
  const containerRef = useRef<T>(null);
  // Reference to the element at the end of the container
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      // Create a mutation observer to detect changes in the container
      const observer = new MutationObserver(() => {
        // Scroll the end element into view whenever content changes
        end.scrollIntoView({ behavior: 'instant', block: 'end' });
      });

      // Observe all possible changes that could affect scrolling
      observer.observe(container, {
        childList: true, // Watch for added/removed elements
        subtree: true, // Watch all descendants
        attributes: true, // Watch for attribute changes
        characterData: true, // Watch for text content changes
      });

      // Clean up the observer when component unmounts
      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
