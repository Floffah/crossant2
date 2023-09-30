/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: false,
            },
        ],
        "@typescript-eslint/no-var-requires": "warn",
        "prettier/prettier": [
            "error",
            // JSON.parse(
            //     readFileSync(resolve(__dirname, "../../.prettierrc"), "utf-8"),
            // ),
            require("../../.prettierrc.js"),
        ],
        "comma-dangle": ["error", "always-multiline"],
    },
    settings: {
        prettier: true,
    },
    env: {
        bun: true
    },
};
