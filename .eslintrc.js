module.exports = {
  root: true,
  env: { es6: true, node: true },
  extends: ["prettier", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: ["./tsconfig.json", "./client/tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "import", "sort-imports-es6-autofix"],
  rules: {
    "import/no-extraneous-dependencies": ["error"],
    "sort-imports-es6-autofix/sort-imports-es6": ["error"],
  },
}
