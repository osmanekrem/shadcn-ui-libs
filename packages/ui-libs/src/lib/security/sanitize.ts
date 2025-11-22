/**
 * Input sanitization functions
 * Tree-shakeable - import only what you need
 */

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Removes dangerous HTML elements and attributes including:
 * - Script tags
 * - JavaScript: URLs
 * - Event handlers (onclick, onerror, etc.)
 * - Unsafe data: URLs
 * - Style expressions
 * 
 * @param input - The HTML string to sanitize
 * @returns Sanitized HTML string with dangerous content removed
 * 
 * @example
 * ```tsx
 * import { sanitizeHtml } from 'tanstack-shadcn-table/security/sanitize';
 * 
 * const unsafe = '<script>alert("xss")</script>Hello';
 * const safe = sanitizeHtml(unsafe); // "Hello"
 * ```
 * 
 * @public
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";

  return (
    input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove javascript: URLs
      .replace(/javascript:/gi, "")
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
      // Remove data: URLs (except safe ones)
      .replace(/data:(?!image\/(png|jpe?g|gif|svg\+xml))[^;]*;/gi, "")
      // Remove style attributes that could contain expressions
      .replace(/style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi, "")
  );
}

/**
 * Sanitizes search input to prevent injection attacks (SQL injection, XSS, etc.).
 * Removes dangerous characters and limits length to prevent DoS attacks.
 * 
 * @param input - The search input string to sanitize
 * @returns Sanitized string with dangerous characters removed (max 1000 characters)
 * 
 * @example
 * ```tsx
 * import { sanitizeSearchInput } from 'tanstack-shadcn-table/security/sanitize';
 * 
 * const unsafe = 'user"; DROP TABLE users; --';
 * const safe = sanitizeSearchInput(unsafe); // "user DROP TABLE users "
 * ```
 * 
 * @public
 */
export function sanitizeSearchInput(input: string): string {
  if (typeof input !== "string") return "";

  return (
    input
      // Remove SQL injection patterns
      .replace(/['";\\]/g, "")
      // Remove potential script injections
      .replace(/<[^>]*>/g, "")
      // Limit length to prevent DoS
      .slice(0, 1000)
      .trim()
  );
}

/**
 * Validates and sanitizes column filter values based on filter type.
 * Applies appropriate sanitization for each filter type:
 * - Text/Custom: Sanitizes as search input
 * - Select/Multi-select: Sanitizes array or string values
 * - Range: Validates and bounds numeric values (-1,000,000 to 1,000,000)
 * - Boolean: Converts to boolean type
 * - Date/Date-range: Validates and formats as ISO date string
 * 
 * @param value - The filter value to sanitize
 * @param filterType - The type of filter ("text", "range", "select", "boolean", "date", etc.)
 * @returns Sanitized filter value appropriate for the filter type
 * 
 * @example
 * ```tsx
 * import { sanitizeFilterValue } from 'tanstack-shadcn-table/security/sanitize';
 * 
 * // Text filter
 * const safeText = sanitizeFilterValue('<script>alert("xss")</script>', 'text');
 * 
 * // Range filter
 * const safeRange = sanitizeFilterValue([-100, 9999999], 'range'); // [-100, 1000000]
 * 
 * // Boolean filter
 * const safeBool = sanitizeFilterValue('true', 'boolean'); // true
 * ```
 * 
 * @public
 */
export function sanitizeFilterValue(value: any, filterType: string): any {
  if (value === null || value === undefined) return value;

  switch (filterType) {
    case "text":
    case "custom":
      return typeof value === "string" ? sanitizeSearchInput(value) : "";

    case "select":
    case "multi-select":
      if (Array.isArray(value)) {
        return value.map((v) =>
          typeof v === "string" ? sanitizeSearchInput(v) : ""
        );
      }
      return typeof value === "string" ? sanitizeSearchInput(value) : "";

    case "range":
      if (Array.isArray(value)) {
        return value.map((v) => {
          const num = Number(v);
          return isNaN(num) ? null : Math.max(-1000000, Math.min(1000000, num));
        });
      }
      const num = Number(value);
      return isNaN(num) ? null : Math.max(-1000000, Math.min(1000000, num));

    case "boolean":
      return typeof value === "boolean" ? value : Boolean(value);

    case "date":
    case "date-range":
      if (Array.isArray(value)) {
        return value.map((v) => {
          const date = new Date(v);
          return isNaN(date.getTime())
            ? null
            : date.toISOString().split("T")[0];
        });
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];

    default:
      return typeof value === "string" ? sanitizeSearchInput(value) : value;
  }
}

