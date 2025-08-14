// htmlvalidate.config.js
module.exports = {
    extends: [
        "html-validate:recommended", // core HTML rules
        // "html-validate:standard", // more strict conformance checks
    ],
    elements: [
        "html5", // full HTML5/WHATWG element set
    ],
    rules: {
        // Keep as close to spec as possible
        "no-trailing-whitespace": "off", // not part of W3C validation
        "void-style": "off", // W3C allows both <br> and <br />
        "no-inline-style": "off", // stylistic, not spec-related

        // Optional: handle React auto-generated IDs to avoid parser crashes
        "id-pattern": ["error", "^[^:]+$"], // forbid colons in IDs (spec-safe)
    },
    // Optional: ignore React-generated problematic attributes
    ignoreAttributes: ["data-testid"],
};
