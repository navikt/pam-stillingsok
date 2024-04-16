const { resolve } = require("node:path");

const { JAVASCRIPT_FILES } = require("@vercel/style-guide/eslint/constants");

const project = resolve(__dirname, "jsconfig.json");

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: [
        require.resolve("@vercel/style-guide/eslint/browser"),
        require.resolve("@vercel/style-guide/eslint/react"),
        require.resolve("@vercel/style-guide/eslint/next"),
        require.resolve("@vercel/style-guide/eslint/node"),
        "plugin:@next/next/recommended",
        "airbnb",
        "next/core-web-vitals",
        "prettier",
    ],
    plugins: ["react", "unused-imports", "prettier"],
    parserOptions: { project },
    settings: {
        "import/resolver": {
            "eslint-import-resolver-custom-alias": {
                alias: {
                    "@/app": "./src/app",
                },
                extensions: [".js", ".jsx"],
                packages: ["packages/*"],
            },
        },
        /**
         * enable MUI Joy components to be checked
         * @see {@link https://github.com/jsx-eslint/eslint-plugin-jsx-a11y?tab=readme-ov-file#configurations}
         */
        "jsx-a11y": {
            polymorphicPropName: "component",
            components: {
                Button: "button",
                Icon: "svg",
                IconButton: "button",
                Image: "img",
                Input: "input",
                Link: "a",
                List: "ul",
                ListItem: "li",
                ListItemButton: "button",
                ListDivider: "li",
                NextImage: "img",
                NextLink: "a",
                Textarea: "textarea",
            },
        },
    },
    rules: {
        "react/function-component-definition": [
            "warn",
            {
                namedComponents: "arrow-function",
                unnamedComponents: "arrow-function",
            },
        ],
        "react/jsx-sort-props": [
            "warn",
            {
                callbacksLast: true,
                shorthandFirst: true,
                multiline: "last",
                reservedFirst: true,
            },
        ],
        // sort import statements
        "import/order": [
            "warn",
            {
                groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                "newlines-between": "always",
                alphabetize: { order: "asc" },
            },
        ],
        // sort named imports within an import statement
        "sort-imports": ["warn", { ignoreDeclarationSort: true }],
    },
};
