module.exports = {
  extends: ["next/core-web-vitals", "prettier"],
  ignorePatterns: ["*.cjs", "node_modules", "build", "coverage"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
