import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: [
      "_site/**",
      "vendor/**",
      "node_modules/**",
      "artifacts/**",
      "playwright-report/**",
      "test-results/**",
      "assets/libs/**",
      "assets/js/**/*.min.js",
      "assets/js/distillpub/**",
      "assets/js/search/**",
      "_scripts/**",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["assets/js/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.jquery,
        determineComputedTheme: "readonly",
        mediumZoom: "readonly",
        medium_zoom: "writable",
        mermaid: "readonly",
        d3: "readonly",
        Diff2HtmlUI: "readonly",
        echarts: "readonly",
        Plotly: "readonly",
        vegaEmbed: "readonly",
        Chart: "readonly",
        L: "readonly",
        Toc: "readonly",
        Masonry: "readonly",
        imagesLoaded: "readonly",
        hljs: "readonly",
        MathJax: "writable",
        pseudocode: "readonly",
        VenoBox: "readonly",
        initTheme: "readonly",
        openSearchModal: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^(initTheme|determineComputedTheme|openSearchModal)$" }],
    },
  },
  {
    files: ["assets/js/*-setup.js", "assets/js/bibsearch.js", "assets/js/highlight-search-term.js"],
    languageOptions: { sourceType: "module" },
  },
  { files: ["tests/**/*.mjs"], languageOptions: { globals: globals.browser } },
  { files: ["assets/js/theme.js"], languageOptions: { globals: { determineComputedTheme: "off", initTheme: "off" } } },
  { ignores: ["assets/js/typograms.js"] },
];
