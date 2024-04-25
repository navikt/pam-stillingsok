const { resolve } = require("node:path");

const project = resolve(__dirname, "jsconfig.json");

/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    extends: ["plugin:@next/next/recommended", "airbnb", "next/core-web-vitals", "prettier"],
    plugins: ["react", "unused-imports", "prettier"],
    parserOptions: { project },
    globals: {
        vi: true,
    },
    settings: {
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
        "no-underscore-dangle": "off",
        "import/prefer-default-export": "off",
        "react/jsx-no-bind": "off",
        "react/no-unescaped-entities": "off",
        "prettier/prettier": "error",
        "react/react-in-jsx-scope": "off",
        "react/jsx-props-no-spreading": "off",
        "react/forbid-prop-types": "off",
        "object-shorthand": "off",
        // defaultProps rule to be deprecated on function components
        // https://github.com/reactjs/rfcs/pull/107
        "react/require-default-props": [
            "error",
            {
                ignoreFunctionalComponents: true,
            },
        ],
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            },
        ],
        singleQuote: "off",
    },
};