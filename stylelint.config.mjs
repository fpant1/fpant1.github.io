export default {
  extends: ["stylelint-config-standard-scss"],
  ignoreFiles: ["_sass/font-awesome/**", "_sass/tabler-icons/**"],
  rules: {
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "custom-property-pattern": null,
    "scss/dollar-variable-pattern": null,
    "no-descending-specificity": null,
  },
};
