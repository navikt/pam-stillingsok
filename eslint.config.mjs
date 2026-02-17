import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import prettierPlugin from "eslint-plugin-prettier";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const config = [
    {
        ignores: [
            "**/.next/**",
            "**/node_modules/**",
            "public/**",
            "coverage/**",
            "dist/**",
            "yarn.lock",
            "package-lock.json",
            "**/*.d.ts",
        ],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                tsconfigRootDir: new URL(".", import.meta.url).pathname,
                project: "./tsconfig.json",
                sourceType: "module",
                ecmaVersion: "latest",
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                JSX: "readonly",
                // eksplisitt fordi vi bruker dem mye:
                fetch: "readonly",
                Request: "readonly",
                Response: "readonly",
            },
        },

        plugins: {
            "@typescript-eslint": tsPlugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "unused-imports": unusedImportsPlugin,
            prettier: prettierPlugin,
            "@next/next": nextPlugin,
        },

        settings: {
            react: {
                version: "detect",
            },
            "jsx-a11y": {
                polymorphicPropName: "as",
                components: {
                    BodyLong: "p",
                    BodyShort: "p",
                    Button: "button",
                    CheckboxGroup: "fieldset",
                    Checkbox: "input",
                    Chips: "ul",
                    Heading: "h",
                    Icon: "svg",
                    IconButton: "button",
                    Image: "img",
                    Input: "input",
                    Link: "a",
                    List: "ul",
                    ListItem: "li",
                    NextImage: "img",
                    NextLink: "a",
                    Pagination: "nav",
                    RadioGroup: "fieldset",
                    Radio: "input",
                    Select: "select",
                    TextField: "input",
                    Textarea: "textarea",
                    Tooltip: "button",
                },
            },
        },

        rules: {
            // ESLint core
            // Basere oss på eslint:recommended
            ...js.configs.recommended.rules,
            // React recommended
            ...reactPlugin.configs.recommended.rules,
            // Next core-web-vitals
            ...nextPlugin.configs["core-web-vitals"].rules,

            // React Hooks – eksplisitt slått på
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // Skru av core-varianten (ren JS)
            "no-redeclare": "off",
            // Bruk TS-varianten i stedet
            "@typescript-eslint/no-redeclare": [
                "error",
                {
                    ignoreDeclarationMerge: true, // viktig for .d.ts / declare global osv.
                },
            ],
            "no-underscore-dangle": "off",
            "react/jsx-no-bind": "off",
            "react/no-unescaped-entities": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-props-no-spreading": "off",
            "object-shorthand": "off",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": "off",

            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            "react/jsx-pascal-case": [
                2,
                {
                    ignore: ["UNSAFE_Combobox"],
                },
            ],

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

            "prettier/prettier": "error",
        },
    },
    {
        files: ["**/*.test.{ts,tsx,js,jsx}", "**/*.spec.{ts,tsx,js,jsx}"],
        languageOptions: {
            globals: {
                describe: "readonly",
                it: "readonly",
                test: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                vi: "readonly",
            },
        },
    },
];

export default config;
