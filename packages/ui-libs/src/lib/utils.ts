import { GetFieldType } from "./utils.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Internal utility function to merge Tailwind CSS classes with clsx and tailwind-merge.
 * This ensures proper class merging and conflict resolution for Tailwind utilities.
 *
 * **Note:** This function is for internal use only and is not exported from the main package.
 * If you need a similar utility, use `clsx` and `tailwind-merge` directly.
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with Tailwind conflicts resolved
 *
 * @internal
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely retrieves a nested value from an object using a dot-notation path string.
 * Supports nested objects, arrays, and optional default values.
 *
 * @template TData - The type of the data object
 * @template TPath - The path string type (e.g., "user.name" or "items[0].id")
 * @template TDefault - The type of the default value (optional)
 *
 * @param data - The data object to extract the value from
 * @param path - Dot-notation path string (e.g., "user.profile.name" or "items[0].id")
 * @param defaultValue - Optional default value to return if the path doesn't exist
 * @returns The value at the specified path, or the default value if not found
 *
 * @example
 * ```tsx
 * import { getValue } from "tanstack-shadcn-table";
 *
 * const user = {
 *   name: "John",
 *   profile: {
 *     email: "john@example.com",
 *   },
 *   items: [{ id: 1 }, { id: 2 }],
 * };
 *
 * // Get nested value
 * const email = getValue(user, "profile.email"); // "john@example.com"
 *
 * // Get array value
 * const firstItemId = getValue(user, "items[0].id"); // 1
 *
 * // With default value
 * const phone = getValue(user, "profile.phone", "N/A"); // "N/A"
 * ```
 */
export function getValue<
  TData,
  TPath extends string,
  TDefault = GetFieldType<TData, TPath>,
>(
  data: TData,
  path: TPath,
  defaultValue?: TDefault
): GetFieldType<TData, TPath> | TDefault {
  const value = path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce<GetFieldType<TData, TPath>>(
      (value, key) => (value as any)?.[key],
      data as any
    );

  return value !== undefined ? value : (defaultValue as TDefault);
}
