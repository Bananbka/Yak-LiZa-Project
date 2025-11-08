
import globals from "globals";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    next,
    ...tseslint.configs.recommended,
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
            }],
        },

    },
    {
        ignores: [".next/*", "node_modules/*", "next.config.mjs", "postcss.config.mjs", "eslint.config.js"],
    }
);