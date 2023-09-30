module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "@crossant/eslint-config",
    ],
    settings: {
        prettier: true,
    },
    env: {
        node: true,
    },
};
