module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react/jsx-runtime", "plugin:react-hooks/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  // plugins: ["react", "react-hooks"],
  // rules: {
  //   // React specific rules
  //   "react/react-in-jsx-scope": "off", // Not needed in React 17+
  //   "react/prop-types": "warn",
  //   "react/jsx-uses-react": "off",
  //   "react/jsx-uses-vars": "error",
  //   "react/jsx-key": "error",
  //   "react/no-array-index-key": "warn",
  //   "react/self-closing-comp": "warn",

  //   // React Hooks rules
  //   "react-hooks/rules-of-hooks": "error",
  //   "react-hooks/exhaustive-deps": "warn",
  //   "react-hooks/refs": "warn",

  //   // General JavaScript rules
  //   "no-console": "warn",
  //   "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  //   "no-var": "error",
  //   "prefer-const": "warn",
  //   "prefer-arrow-callback": "warn",
  //   "no-debugger": "warn",

  //   // Code style
  //   // semi: ["error", "always"],
  //   // quotes: ["warn", "double", { avoidEscape: true }],
  //   // indent: ["error", 2],
  //   "comma-dangle": ["warn", "always-multiline"],
  // },
  settings: {
    react: {
      version: "detect",
    },
  },
};
