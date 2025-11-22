export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    cssnano: {
      preset: [
        "default",
        {
          // Comment removal
          discardComments: {
            removeAll: true,
          },
          // Whitespace normalization
          normalizeWhitespace: true,
          // Color optimization
          colormin: true,
          // Font optimization
          minifyFontValues: true,
          // Gradient optimization
          minifyGradients: true,
          // Parameter optimization
          minifyParams: true,
          // Selector optimization
          minifySelectors: true,
          // Merge optimizations
          mergeLonghand: true,
          mergeRules: true,
          // Reduce optimizations
          reduceIdents: false, // Keep for animations
          reduceInitial: true,
          reduceTransforms: true,
          // Unique selectors
          uniqueSelectors: true,
          // Z-index optimization (disabled to prevent conflicts)
          zindex: false,
          // Discard optimizations
          discardDuplicates: true,
          discardEmpty: true,
          discardOverridden: true,
          // Aggressive unused CSS removal for production
          discardUnused: process.env.NODE_ENV === "production",
          // Additional aggressive optimizations
          discardEmpty: true,
          discardDuplicates: true,
          discardOverridden: true,
          // Normalization optimizations
          normalizeCharset: true,
          normalizeDisplayValues: true,
          normalizePositions: true,
          normalizeRepeatStyle: true,
          normalizeString: true,
          normalizeTimingFunctions: true,
          normalizeUnicode: true,
          normalizeUrl: true,
          // Value ordering
          orderedValues: true,
          // Calc optimization
          reduceCalc: true,
          // SVG optimization (disabled - not needed for CSS)
          svgo: false,
          // Additional aggressive optimizations for production
          ...(process.env.NODE_ENV === "production" && {
            // Convert colors to shorter format
            convertValues: true,
            // Discard unused font faces
            discardFontFace: false, // Keep fonts for library
            // Discard unused keyframes
            discardKeyframes: false, // Keep animations for library
            // Optimize selectors
            optimizeIdents: false, // Keep for compatibility
          }),
        },
      ],
    },
  },
};
