import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for debouncing values
 *
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500)
 * @param callback - The callback function to call with the debounced value
 *
 * @example
 * ```tsx
 * import { useDebounce } from '@/lib/hooks/use-debounce';
 *
 * const [searchTerm, setSearchTerm] = useState('');
 *
 * useDebounce(searchTerm, 500, (debouncedValue) => {
 *   // This will be called 500ms after the user stops typing
 *   performSearch(debouncedValue);
 * });
 * ```
 */
export function useDebounce<T>(
  value: T,
  delay: number,
  callback: (debouncedValue: T) => void
): void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  const previousValueRef = useRef<T | undefined>(undefined);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      // Only call callback if value has changed
      if (previousValueRef.current !== value) {
        previousValueRef.current = value;
        callbackRef.current(value);
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);
}
