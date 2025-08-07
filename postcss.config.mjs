export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    cssnano: {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        colormin: true,
        minifyFontValues: true,
        minifyGradients: true,
        minifyParams: true,
        minifySelectors: true,
        mergeLonghand: true,
        mergeRules: true,
        reduceIdents: false,
        reduceInitial: true,
        reduceTransforms: true,
        uniqueSelectors: true,
        zindex: false,
      }]
    }
  },
}
