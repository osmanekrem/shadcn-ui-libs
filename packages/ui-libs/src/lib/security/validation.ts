/**
 * Validation functions
 * Tree-shakeable - import only what you need
 */

import { sanitizeSearchInput } from './sanitize';

/**
 * Validates and sanitizes pagination parameters to prevent abuse and DoS attacks.
 * Ensures pageIndex and pageSize are within safe bounds:
 * - pageIndex: 0 to 10,000 (bounded)
 * - pageSize: 1 to 1,000 (bounded)
 * 
 * @param pageIndex - The page index to validate (0-based)
 * @param pageSize - The page size to validate
 * @returns Object with validated and bounded pageIndex and pageSize
 * 
 * @example
 * ```tsx
 * import { validatePaginationParams } from 'tanstack-shadcn-table/security/validation';
 * 
 * // Invalid values are bounded
 * const { pageIndex, pageSize } = validatePaginationParams(-1, 999999);
 * // Result: { pageIndex: 0, pageSize: 1000 }
 * 
 * // Valid values are preserved
 * const valid = validatePaginationParams(5, 20);
 * // Result: { pageIndex: 5, pageSize: 20 }
 * ```
 * 
 * @public
 */
export function validatePaginationParams(
  pageIndex: number,
  pageSize: number
): {
  pageIndex: number;
  pageSize: number;
} {
  const safePageIndex = Math.max(
    0,
    Math.min(10000, Math.floor(Number(pageIndex) || 0))
  );
  const safePageSize = Math.max(
    1,
    Math.min(1000, Math.floor(Number(pageSize) || 10))
  );

  return {
    pageIndex: safePageIndex,
    pageSize: safePageSize,
  };
}

/**
 * Validates and sanitizes sorting parameters to prevent abuse.
 * Limits the number of sort columns to 10 and sanitizes column IDs.
 * 
 * @param sorting - Array of sorting objects with `id` and `desc` properties
 * @returns Array of validated and sanitized sorting objects (max 10 items)
 * 
 * @example
 * ```tsx
 * import { validateSortingParams } from 'tanstack-shadcn-table/security/validation';
 * 
 * const unsafe = [
 *   { id: '<script>alert("xss")</script>name', desc: false },
 *   { id: 'age', desc: true },
 * ];
 * const safe = validateSortingParams(unsafe);
 * // Result: [{ id: 'name', desc: false }, { id: 'age', desc: true }]
 * ```
 * 
 * @public
 */
export function validateSortingParams(sorting: any[]): any[] {
  if (!Array.isArray(sorting)) return [];

  return sorting
    .slice(0, 10) // Limit number of sort columns
    .map((sort) => {
      if (!sort || typeof sort !== "object") return null;

      const id =
        typeof sort.id === "string" ? sanitizeSearchInput(sort.id) : "";
      const desc = Boolean(sort.desc);

      return id ? { id, desc } : null;
    })
    .filter(Boolean);
}

/**
 * Validates file uploads to ensure they meet security requirements.
 * Checks file size (max 10MB) and file type (whitelist of allowed types).
 * 
 * Allowed file types:
 * - Images: JPEG, PNG, GIF, WebP
 * - Documents: PDF, CSV, Excel (XLS, XLSX)
 * 
 * @param file - The File object to validate
 * @returns Object with `isValid` boolean and optional `error` message
 * 
 * @example
 * ```tsx
 * import { validateFileUpload } from 'tanstack-shadcn-table/security/validation';
 * 
 * const handleFileUpload = (file: File) => {
 *   const { isValid, error } = validateFileUpload(file);
 *   if (!isValid) {
 *     alert(error);
 *     return;
 *   }
 *   // Process safe file
 * };
 * ```
 * 
 * @public
 */
export function validateFileUpload(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size exceeds 10MB limit",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "File type not allowed",
    };
  }

  return { isValid: true };
}

