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
      declarationDir: "./dist",
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
};

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
      exclude: ["**/*.stories.*", "**/*.test.*"],
      compilerOptions: {
        declaration: true,
        declarationDir: "./dist/security",
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

export default [
  // Main entry point (table)
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        exports: "named",
        sourcemap: false,
        inlineDynamicImports: true, // Inline dynamic imports for CJS
      },
      {
        file: "dist/index.esm.js",
        format: "esm",
        exports: "named",
        sourcemap: false,
        inlineDynamicImports: true, // Inline dynamic imports for ESM
      },
    ],
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
        open: process.env.NODE_ENV !== "production", // Only open in dev mode
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    external: sharedExternal,
    treeshake: sharedTreeshake,
  },
  // Table elements entry point (addons)
  {
    input: "src/table-elements/index.ts",
    output: [
      {
        file: "dist/table-elements.js",
        format: "cjs",
        exports: "named",
        sourcemap: false,
      },
      {
        file: "dist/table-elements.esm.js",
        format: "esm",
        exports: "named",
        sourcemap: false,
      },
    ],
    plugins: [
      ...sharedPlugins,
      visualizer({
        filename: "bundle-analysis-table-elements.html",
        open: process.env.NODE_ENV !== "production", // Only open in dev mode
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
];
