#!/usr/bin/env node

/**
 * Generate TypeScript declaration files for i18n locales
 */

const fs = require("fs");
const path = require("path");

const DIST_I18N_DIR = path.join(__dirname, "../dist/i18n");
const LOCALES = [
  { file: "en", export: "defaultTranslations" },
  { file: "tr", export: "turkishTranslations" },
  { file: "es", export: "spanishTranslations" },
  { file: "fr", export: "frenchTranslations" },
  { file: "de", export: "germanTranslations" },
];

// Ensure directory exists
if (!fs.existsSync(DIST_I18N_DIR)) {
  fs.mkdirSync(DIST_I18N_DIR, { recursive: true });
}

// Generate declaration files
LOCALES.forEach(({ file, export: exportName }) => {
  const content = `import type { TableTranslations } from "../lib/i18n/types";
export declare const ${exportName}: TableTranslations;
`;

  fs.writeFileSync(
    path.join(DIST_I18N_DIR, `${file}.d.ts`),
    content,
    "utf-8"
  );
});

console.log("✅ Generated i18n TypeScript declaration files");

