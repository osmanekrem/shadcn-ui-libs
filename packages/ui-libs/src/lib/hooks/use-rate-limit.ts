import { useRef, useCallback } from "react";

/**
 * Custom hook for rate limiting function calls
 *
 * @param limit - Maximum number of calls allowed (default: 10)
 * @param windowMs - Time window in milliseconds (default: 1000)
 * @returns A function that returns true if the call is allowed, false otherwise
 *
 * @example
 * ```tsx
 * import { useRateLimit } from '@/lib/hooks/use-rate-limit';
 *
 * const checkRateLimit = useRateLimit(10, 1000);
 *
 * const handleInput = () => {
 *   if (!checkRateLimit()) {
 *     console.warn('Rate limit exceeded');
 *     return;
 *   }
 *   // Process input
 * };
 * ```
 */
export function useRateLimit(
  limit: number = 10,
  windowMs: number = 1000
): () => boolean {
  const requests = useRef<number[]>([]);

  return useCallback(() => {
    const now = Date.now();
    // Remove requests outside the time window
    requests.current = requests.current.filter((time) => now - time < windowMs);

    // Check if limit is exceeded
    if (requests.current.length >= limit) {
      return false;
    }

    // Add current request
    requests.current.push(now);
    return true;
  }, [limit, windowMs]);
}
