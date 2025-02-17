module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["react", "@typescript-eslint", "prettier", "import"],
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
          "pathGroups": [
            {
              "pattern": "react",
              "group": "builtin",
              "position": "before",
            }
          ],
          "pathGroupsExcludedImportTypes": ["react"],
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true,
          },
          "newlines-between": "always",
        },
      ],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-default-export": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  