import { useCallback } from 'react';

/**
 * Custom hook to fix the typing issues with react-dnd refs
 * Had to create this because of TypeScript errors with the regular approach
 */
export function useDndRef(refCallback: any) {
  // Just wrapping the callback in useCallback to avoid recreating it
  return useCallback(
    (node: HTMLElement | null) => {
      // Skip if ref is null
      if (!node) return;
      
      // Pass the node to the original callback if it's callable
      if (refCallback && typeof refCallback === 'function') {
        refCallback(node);
      }
    },
    [refCallback] // Only recreate if the ref callback changes
  );
} 
