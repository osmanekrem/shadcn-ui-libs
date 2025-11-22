/**
 * Hooks exports - Tree-shakeable
 * 
 * Import only what you need:
 * 
 * @example
 * // ✅ Tree-shakeable - only imports useDebounce
 * import { useDebounce } from '@/lib/hooks/use-debounce';
 * 
 * // ✅ Tree-shakeable - only imports useRateLimit
 * import { useRateLimit } from '@/lib/hooks/use-rate-limit';
 * 
 * // ❌ Imports all hooks (not recommended for tree-shaking)
 * import { useDebounce, useRateLimit } from '@/lib/hooks';
 */

export { useDebounce } from "./use-debounce";
export { useRateLimit } from "./use-rate-limit";

