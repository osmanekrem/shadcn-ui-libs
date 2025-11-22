// Main Components - Core functionality
export {
  DataTable,
  fuzzyFilter,
  fuzzySort,
} from "./components/custom/datatable";

// Utility Components - Optional features
export { default as DebouncedInput } from "./components/custom/debounced-input";
export { default as FilterInput } from "./components/custom/filter-input";
export { default as ColumnResizeHandle } from "./components/custom/column-resize-handle";

// Security Utilities - Optional security features
// For tree-shaking, import directly from sub-modules:
// import { sanitizeSearchInput } from "tanstack-shadcn-table/lib/security/sanitize";
export {
  sanitizeHtml,
  sanitizeSearchInput,
  sanitizeFilterValue,
  validatePaginationParams,
  validateSortingParams,
  validateFileUpload,
  RateLimiter,
  CSP_DIRECTIVES,
} from "./lib/security";

// Internationalization - Optional i18n features
// For tree-shaking, import translations directly from locales:
// import { defaultTranslations } from "tanstack-shadcn-table/lib/i18n/locales/en";
export {
  defaultTranslations,
  turkishTranslations,
  spanishTranslations,
  frenchTranslations,
  germanTranslations,
  availableLanguages,
  createTranslator,
  t,
  interpolate,
} from "./lib/i18n";
export type { TableTranslations, SupportedLanguage } from "./lib/i18n";

// Tree-shakeable locale exports (recommended)
// Import directly: import { defaultTranslations } from "tanstack-shadcn-table/i18n/en"
export { defaultTranslations as enTranslations } from "./lib/i18n/locales/en";
export { turkishTranslations as trTranslations } from "./lib/i18n/locales/tr";
export { spanishTranslations as esTranslations } from "./lib/i18n/locales/es";
export { frenchTranslations as frTranslations } from "./lib/i18n/locales/fr";
export { germanTranslations as deTranslations } from "./lib/i18n/locales/de";

// Types
export type {
  Column,
  ColumnDef,
  FilterType,
  TableOptions,
  PaginationOptions,
  LazyLoadEvent,
  SortingState,
} from "./types/types";

// Utils
export { getValue } from "./lib/utils";
