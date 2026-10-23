module.exports = {
  content: ["_site/**/*.html", "_site/assets/js/*.js"],
  css: ["_site/assets/css/*.css"],
  skippedContentGlobs: ["_site/assets/**/*.html"],
  safelist: {
    standard: ["navigation-ready", "transition", "table-dark", "show", "collapsing", "collapsed", "active", "fade", "modal-open"],
    deep: [/^swiper/, /^medium-zoom/, /^highlight/, /^language-/, /^hljs/, /^mjx/, /^MathJax/, /^giscus/, /^toc/],
    greedy: [/data-theme/, /prefers-reduced-motion/],
  },
};
