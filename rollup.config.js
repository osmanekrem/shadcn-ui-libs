import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      exports: "named",
      sourcemap: false, // Production'da source map'i kaldır
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      exports: "named",
      sourcemap: false, // Production'da source map'i kaldır
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
        declarationDir: "./dist",
      },
    }),
    postcss({
      config: {
        path: "./postcss.config.js",
      },
      extensions: [".css"],
      minimize: true,
      inject: {
        insertAt: "top",
      },
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
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
    visualizer({
      filename: "bundle-analysis.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  external: [
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
    "tailwind-merge"
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
};
