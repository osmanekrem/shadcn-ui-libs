/**
 * Internationalization utility functions
 */

import type { TableTranslations } from "./types";

/**
 * Simple template string replacement function.
 * Replaces placeholders in the format `{key}` with corresponding values.
 * 
 * @param template - Template string with placeholders (e.g., "Hello {name}!")
 * @param values - Object with values to replace placeholders
 * @returns String with placeholders replaced by values
 * 
 * @example
 * ```tsx
 * import { interpolate } from 'tanstack-shadcn-table';
 * 
 * const message = interpolate("Hello {name}!", { name: "World" });
 * // Result: "Hello World!"
 * 
 * const total = interpolate("Total: {count} items", { count: 42 });
 * // Result: "Total: 42 items"
 * ```
 * 
 * @public
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

/**
 * Gets a translation value from the translations object using a dot-notation path.
 * Supports nested objects and string interpolation.
 * 
 * @param translations - The translations object to extract the value from
 * @param path - Dot-notation path to the translation key (e.g., "pagination.next")
 * @param values - Optional object with values for string interpolation
 * @returns The translated string with interpolated values, or the path if not found
 * 
 * @example
 * ```tsx
 * import { t } from 'tanstack-shadcn-table';
 * import { turkishTranslations } from 'tanstack-shadcn-table/i18n/tr';
 * 
 * // Simple translation
 * const next = t(turkishTranslations, "pagination.next");
 * // Result: "Sonraki"
 * 
 * // Translation with interpolation
 * const total = t(turkishTranslations, "pagination.totalRecords", { total: 100 });
 * // Result: "Toplam: 100 kayıt"
 * ```
 * 
 * @public
 */
export function t(
  translations: TableTranslations,
  path: string,
  values?: Record<string, string | number>
): string {
  const keys = path.split(".");
  let result: any = translations;

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
  }

  if (typeof result !== "string") {
    console.warn(`Translation value is not a string: ${path}`);
    return path;
  }

  return values ? interpolate(result, values) : result;
}

/**
 * Creates a translation function bound to specific translations.
 * This is useful for creating a reusable translator function that doesn't require
 * passing the translations object every time.
 * 
 * @param translations - The translations object to bind to the translator function
 * @returns A function that takes a path and optional values, returning the translated string
 * 
 * @example
 * ```tsx
 * import { createTranslator } from 'tanstack-shadcn-table';
 * import { turkishTranslations } from 'tanstack-shadcn-table/i18n/tr';
 * 
 * // Create a bound translator
 * const t = createTranslator(turkishTranslations);
 * 
 * // Use the translator
 * const next = t("pagination.next"); // "Sonraki"
 * const total = t("pagination.totalRecords", { total: 100 }); // "Toplam: 100 kayıt"
 * ```
 * 
 * @public
 */
export function createTranslator(translations: TableTranslations) {
  return (path: string, values?: Record<string, string | number>) =>
    t(translations, path, values);
}

