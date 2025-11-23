import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

const sharedPlugins = [
  peerDepsExternal(),
  resolve({
    browser: true,
    preferBuiltins: true,
  }),
  commonjs({
    include: /node_modules/,
    transformMixedEsModules: true,
  }),
  typescript({
    tsconfig: "./tsconfig.json",
    exclude: ["**/*.stories.*", "**/*.test.*"],
    compilerOptions: {
      declaration: true,
      declarationMap: false, // Source maps kaldırıldı - paket boyutu optimizasyonu
      declarationDir: "./dist",
      module: "ESNext",
      moduleResolution: "node",
    },
  }),
  terser({
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: [
        "console.log",
        "console.info",
        "console.debug",
        "console.warn",
        "console.error",
        "console.trace",
      ],
      passes: 3, // CJS için daha fazla pass (2 → 3)
      unsafe: true,
      unsafe_comps: true,
      unsafe_Function: true,
      unsafe_math: true,
      unsafe_proto: true,
      unsafe_regexp: true,
      unsafe_undefined: true,
      dead_code: true, // Dead code elimination
      unused: true, // Unused code removal
      collapse_vars: true, // Variable collapsing
      reduce_vars: true, // Variable reduction
      inline: 2, // More aggressive inlining
      keep_fargs: false, // Remove unused function arguments
      keep_infinity: false, // Optimize Infinity
      side_effects: false, // Assume no side effects for better optimization
    },
    mangle: {
      properties: {
        regex: /^_/,
      },
      toplevel: true, // Mangle top-level names (CJS için güvenli)
    },
    format: {
      comments: false, // Remove all comments
      ascii_only: false, // Allow unicode (smaller size)
    },
  }),
];

const sharedExternal = [
  "react",
  "react-dom",
  "@radix-ui/react-checkbox",
  "@radix-ui/react-dropdown-menu",
  "@radix-ui/react-select",
  "@radix-ui/react-slot",
  "@tanstack/react-table",
  "@tanstack/match-sorter-utils",
  "class-variance-authority",
  "clsx",
  "lucide-react",
  "tailwind-merge",
];

const sharedTreeshake = {
  moduleSideEffects: false,
  propertyReadSideEffects: false,
  unknownGlobalSideEffects: false,
  // CJS için daha agresif tree-shaking
  tryCatchDeoptimization: false, // Try-catch optimizasyonu
  manualPureFunctions: [
    "Object.freeze",
    "Object.defineProperty",
    "Object.defineProperties",
  ],
};

// Feature-based code splitting function for ESM
function createManualChunks(id) {
  // Filtering features
  if (
    id.includes("filter-input") ||
    id.includes("fuzzyFilter") ||
    id.includes("fuzzy-filter")
  ) {
    return "filtering";
  }

  // Sorting features
  if (
    id.includes("fuzzySort") ||
    id.includes("fuzzy-sort") ||
    id.includes("sorting")
  ) {
    return "sorting";
  }

  // Pagination features
  if (id.includes("pagination")) {
    return "pagination";
  }

  // Column resizing features
  if (id.includes("column-resize") || id.includes("columnResize")) {
    return "column-resizing";
  }

  // Row selection features
  if (id.includes("checkbox") && id.includes("components")) {
    return "row-selection";
  }

  // Drag and drop features
  if (
    id.includes("dnd") ||
    id.includes("draggable") ||
    id.includes("sortable") ||
    id.includes("@dnd-kit")
  ) {
    return "drag-drop";
  }

  // UI components (shared)
  if (id.includes("components/ui/")) {
    return "ui-components";
  }

  // Utilities
  if (id.includes("lib/utils") || id.includes("lib/i18n")) {
    return "utils";
  }

  // Security utilities
  if (id.includes("lib/security")) {
    return "security";
  }
}

// Locale entry points for tree-shaking
const localeConfigs = [
  { lang: "en", name: "defaultTranslations" },
  { lang: "tr", name: "turkishTranslations" },
  { lang: "es", name: "spanishTranslations" },
  { lang: "fr", name: "frenchTranslations" },
  { lang: "de", name: "germanTranslations" },
];

// Security module entry points for tree-shaking
const securityModules = [
  { module: "sanitize", path: "lib/security/sanitize" },
  { module: "validation", path: "lib/security/validation" },
  { module: "rate-limiter", path: "lib/security/rate-limiter" },
  { module: "csp", path: "lib/security/csp" },
];

// Hooks module entry points for tree-shaking
const hooksModules = [
  { module: "use-debounce", path: "lib/hooks/use-debounce" },
  { module: "use-rate-limit", path: "lib/hooks/use-rate-limit" },
];

const localeBuilds = localeConfigs.map(({ lang }) => ({
  input: `src/lib/i18n/locales/${lang}.ts`,
  output: [
    {
      file: `dist/i18n/${lang}.js`,
      format: "cjs",
      exports: "named",
      sourcemap: false,
    },
    {
      file: `dist/i18n/${lang}.esm.js`,
      format: "esm",
      exports: "named",
      sourcemap: false,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      exclude: ["**/*.stories.*", "**/*.test.*"],
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        composite: false,
        module: "ESNext",
        moduleResolution: "node",
      },
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    }),
  ],
  external: sharedExternal,
  treeshake: sharedTreeshake,
}));

const securityBuilds = securityModules.map(({ module, path }) => ({
  input: `src/${path}.ts`,
  output: [
    {
      file: `dist/security/${module}.js`,
      format: "cjs",
      exports: "named",
      sourcemap: false,
    },
    {
      file: `dist/security/${module}.esm.js`,
      format: "esm",
      exports: "named",
      sourcemap: false,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      // Sadece ilgili dosyayı işle - tüm projeyi değil
      include: [`src/${path}.ts`],
      exclude: [
        "**/*.stories.*",
        "**/*.test.*",
        "**/components/**",
        "**/datatable/**",
        "**/ui-elements/**",
        "**/table-elements/**",
        "**/hooks/**",
        // Diğer security modüllerini de exclude et - sadece mevcut modülü işle
        ...securityModules
          .filter((m) => m.module !== module)
          .map((m) => `src/${m.path}.ts`),
      ],
      compilerOptions: {
        declaration: true,
        declarationMap: false,
        declarationDir: "./dist/security",
        emitDeclarationOnly: false,
        composite: false,
        skipLibCheck: true,
        module: "ESNext",
        moduleResolution: "node",
      },
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    }),
  ],
  external: sharedExternal,
  treeshake: sharedTreeshake,
}));

const hooksBuilds = hooksModules.map(({ module, path }) => ({
  input: `src/${path}.ts`,
  output: [
    {
      file: `dist/hooks/${module}.js`,
      format: "cjs",
      exports: "named",
      sourcemap: false,
    },
    {
      file: `dist/hooks/${module}.esm.js`,
      format: "esm",
      exports: "named",
      sourcemap: false,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs({
      include: /node_modules/,
      transformMixedEsModules: true,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      // Sadece ilgili dosyayı işle - tüm projeyi değil
      include: [`src/${path}.ts`],
      exclude: [
        "**/*.stories.*",
        "**/*.test.*",
        "**/components/**",
        "**/datatable/**",
        "**/ui-elements/**",
        "**/table-elements/**",
        "**/security/**",
        // Diğer hooks modüllerini de exclude et - sadece mevcut modülü işle
        ...hooksModules
          .filter((m) => m.module !== module)
          .map((m) => `src/${m.path}.ts`),
      ],
      compilerOptions: {
        declaration: true,
        declarationMap: false,
        declarationDir: "./dist/hooks",
        emitDeclarationOnly: false,
        composite: false,
        skipLibCheck: true,
        module: "ESNext",
        moduleResolution: "node",
      },
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    }),
  ],
  external: sharedExternal,
  treeshake: sharedTreeshake,
}));

const buildConfigs = [
  // Main entry point (table) - CJS format (no code splitting, but optimized)
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
      sourcemap: false,
      inlineDynamicImports: true, // Inline dynamic imports for CJS (code splitting not supported)
      compact: true, // Remove whitespace
      generatedCode: {
        constBindings: true, // Use const instead of var for better minification
      },
    },
    plugins: [
      ...sharedPlugins,
      postcss({
        config: {
          path: "./postcss.config.mjs",
        },
        extensions: [".css"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
      }),
      visualizer({
        filename: "bundle-analysis-table.html",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // Main entry point (table) - ESM format with code splitting
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      exports: "named",
      sourcemap: false,
      entryFileNames: "index.esm.js",
      inlineDynamicImports: false, // Enable code splitting for ESM
      manualChunks: createManualChunks,
      chunkFileNames: "chunks/[name]-[hash].js", // Output chunks to separate files
    },
    plugins: [
      ...sharedPlugins,
      postcss({
        config: {
          path: "./postcss.config.mjs",
        },
        extensions: [".css"],
        minimize: true,
        inject: {
          insertAt: "top",
        },
      }),
      visualizer({
        filename: "bundle-analysis-table-esm.html",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // Table elements entry point (addons) - CJS format (optimized)
  {
    input: "src/table-elements/index.ts",
    output: {
      file: "dist/table-elements.js",
      format: "cjs",
      exports: "named",
      sourcemap: false,
      inlineDynamicImports: true, // Inline for CJS
      compact: true, // Remove whitespace
      generatedCode: {
        constBindings: true, // Use const instead of var
      },
    },
    plugins: [
      ...sharedPlugins,
      visualizer({
        filename: "bundle-analysis-table-elements.html",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // Table elements entry point (addons) - ESM format with code splitting
  {
    input: "src/table-elements/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      exports: "named",
      sourcemap: false,
      entryFileNames: "table-elements.esm.js",
      inlineDynamicImports: false, // Enable code splitting for ESM
      manualChunks: createManualChunks,
      chunkFileNames: "chunks/[name]-[hash].js",
    },
    plugins: [
      ...sharedPlugins,
      visualizer({
        filename: "bundle-analysis-table-elements-esm.html",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // UI elements entry point - CJS format (optimized)
  {
    input: "src/ui-elements/index.ts",
    output: {
      file: "dist/ui-elements.js",
      format: "cjs",
      exports: "named",
      sourcemap: false,
      inlineDynamicImports: true, // Inline for CJS
      compact: true, // Remove whitespace
      generatedCode: {
        constBindings: true, // Use const instead of var
      },
    },
    plugins: [
      ...sharedPlugins,
      visualizer({
        filename: "bundle-analysis-ui-elements.html",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // UI elements entry point - ESM format with code splitting
  {
    input: "src/ui-elements/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      exports: "named",
      sourcemap: false,
      entryFileNames: "ui-elements.esm.js",
      inlineDynamicImports: false, // Enable code splitting for ESM
      manualChunks: createManualChunks,
      chunkFileNames: "chunks/[name]-[hash].js",
    },
    plugins: [
      ...sharedPlugins,
      visualizer({
        filename: "bundle-analysis-ui-elements-esm.html",
        open: process.env.ANALYZE === "true",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // Locale entry points (tree-shakeable)
  ...localeBuilds,
  // Security module entry points (tree-shakeable)
  ...securityBuilds,
  // Hooks module entry points (tree-shakeable)
  ...hooksBuilds,
];

// Final cleanup - son build'e cleanup plugin'i ekle
const configsWithCleanup = buildConfigs.map((config, index, array) => {
  // Son build'e cleanup plugin'i ekle
  if (index === array.length - 1 && config.plugins) {
    config.plugins.push({
      name: "final-cleanup",
      buildEnd() {
        const fs = require("fs");
        const path = require("path");

        // Security klasöründeki gereksiz dosyaları temizle
        const securityDir = path.join(process.cwd(), "dist/security");
        if (fs.existsSync(securityDir)) {
          const allowedFiles = securityModules.map((m) => m.module);
          try {
            const files = fs.readdirSync(securityDir, { recursive: true });
            files.forEach((file) => {
              const filePath = path.join(securityDir, file);
              try {
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                  // Alt klasörleri sil
                  fs.rmSync(filePath, { recursive: true, force: true });
                } else if (file.endsWith(".d.ts")) {
                  // Sadece izin verilen modüllerin declaration dosyalarını tut
                  const fileName = path.basename(file, ".d.ts");
                  if (
                    !allowedFiles.includes(fileName) &&
                    fileName !== "index"
                  ) {
                    fs.unlinkSync(filePath);
                  }
                }
              } catch (e) {
                // Ignore errors
              }
            });
          } catch (e) {
            // Ignore errors
          }
        }

        // Hooks klasöründeki gereksiz dosyaları temizle
        const hooksDir = path.join(process.cwd(), "dist/hooks");
        if (fs.existsSync(hooksDir)) {
          const allowedFiles = hooksModules.map((m) => m.module);
          try {
            const files = fs.readdirSync(hooksDir, { recursive: true });
            files.forEach((file) => {
              const filePath = path.join(hooksDir, file);
              try {
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                  // Alt klasörleri sil
                  fs.rmSync(filePath, { recursive: true, force: true });
                } else if (file.endsWith(".d.ts")) {
                  // Sadece izin verilen modüllerin declaration dosyalarını tut
                  const fileName = path.basename(file, ".d.ts");
                  if (
                    !allowedFiles.includes(fileName) &&
                    fileName !== "index"
                  ) {
                    fs.unlinkSync(filePath);
                  }
                }
              } catch (e) {
                // Ignore errors
              }
            });
          } catch (e) {
            // Ignore errors
          }
        }

        // Create re-export declaration files for subpath exports
        const distDir = path.join(process.cwd(), "dist");
        
        // table-elements.d.ts
        const tableElementsIndex = path.join(distDir, "table-elements/index.d.ts");
        const tableElementsDts = path.join(distDir, "table-elements.d.ts");
        if (fs.existsSync(tableElementsIndex)) {
          fs.writeFileSync(
            tableElementsDts,
            'export * from "./table-elements/index";\n',
            "utf-8"
          );
        }

        // ui-elements.d.ts
        const uiElementsIndex = path.join(distDir, "ui-elements/index.d.ts");
        const uiElementsDts = path.join(distDir, "ui-elements.d.ts");
        if (fs.existsSync(uiElementsIndex)) {
          fs.writeFileSync(
            uiElementsDts,
            'export * from "./ui-elements/index";\n',
            "utf-8"
          );
        }
      },
    });
  }
  return config;
});

export default configsWithCleanup;
