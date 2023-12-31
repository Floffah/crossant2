module.exports = {
    trailingComma: "all",
    tabWidth: 4,
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    jsxBracketSameLine: false,
    arrowParens: "always",
    endOfLine: "lf",
    embeddedLanguageFormatting: "auto",
    tailwindConfig: "./apps/web/tailwind.config.js",

    importOrder: [
        "reflect-metadata",
        "<THIRD_PARTY_MODULES>",
        "^@crossant/(.*)$",
        "@/(.*)$",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderGroupNamespaceSpecifiers: true,

    plugins: [
        "prettier-plugin-tailwindcss",
        "@trivago/prettier-plugin-sort-imports",
    ],
};
