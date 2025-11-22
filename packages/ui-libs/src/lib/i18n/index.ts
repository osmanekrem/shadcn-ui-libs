/**
 * Main i18n exports
 * 
 * For tree-shaking, import translations directly from locales:
 * 
 * @example
 * ```ts
 * // ✅ Tree-shakeable - only imports English
 * import { defaultTranslations } from 'tanstack-shadcn-table/i18n/en';
 * 
 * // ❌ Imports all languages
 * import { defaultTranslations } from 'tanstack-shadcn-table/lib/i18n';
 * ```
 */

// Re-export types
export type { TableTranslations, SupportedLanguage } from "./types";

// Re-export utilities
export { t, interpolate, createTranslator } from "./utils";

// Re-export all locales (for convenience, but not tree-shakeable)
// For tree-shaking, import directly from ./locales/{lang}
export {
  defaultTranslations,
  turkishTranslations,
  spanishTranslations,
  frenchTranslations,
  germanTranslations,
} from "./locales";

// Available languages map (lazy-loaded for tree-shaking)
import { defaultTranslations } from "./locales/en";
import { turkishTranslations } from "./locales/tr";
import { spanishTranslations } from "./locales/es";
import { frenchTranslations } from "./locales/fr";
import { germanTranslations } from "./locales/de";

export const availableLanguages = {
  en: { name: "English", translations: defaultTranslations },
  tr: { name: "Türkçe", translations: turkishTranslations },
  es: { name: "Español", translations: spanishTranslations },
  fr: { name: "Français", translations: frenchTranslations },
  de: { name: "Deutsch", translations: germanTranslations },
} as const;

