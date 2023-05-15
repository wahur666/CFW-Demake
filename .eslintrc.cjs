module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "react-hooks", "prettier"],
    rules: {
        "react/react-in-jsx-scope": 0,
        "@typescript-eslint/no-explicit-any": 0,
        camelcase: "error",
        quotes: ["error", "double"],
        "no-duplicate-imports": "error",
        "@typescript-eslint/no-inferrable-types": 0,
    },
    settings: {
        "import/resolver": {
            typescript: {},
        },
    },
};
