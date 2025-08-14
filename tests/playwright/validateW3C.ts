import { HtmlValidate } from "html-validate";
export function validateW3C(html: string): string[] {
    // Create an instance
    const htmlvalidate = new HtmlValidate({
        extends: [
            "html-validate:recommended", // core HTML rules
            "html-validate:standard", // more strict conformance checks
        ],
        elements: [
            "html5", // full HTML5/WHATWG element set
        ],
        rules: {
            // Document structure
            doctype: "error",
            "missing-doctype": "error",
            "html-element-missing": "error",
            "missing-lang": "error",
            "meta-charset-style": "error",

            // Element/content model enforcement (core spec checks)
            "element-permitted-content": "error",
            "element-permitted-occurrences": "error",
            "element-permitted-order": "error",
            "element-permitted-parent": "error",
            "element-required-ancestor": "error",
            "element-required-attributes": "error",
            "element-required-content": "error",

            // Titles/head
            "empty-heading": "error",
            "empty-title": "error",
            "long-title": "warn",

            // Attributes
            // Note: html-validate may implement slightly different attribute checks than Nu.
            "attr-case": "error",
            "attr-quotes": "error",
            "boolean-attr-value": "error",
            "id-unique": "error",
            "map-id-name": "error",

            // Forms and inputs
            "form-dup-name": "error",
            "input-attributes": "error",
            "multiple-labeled-controls": "error",

            // Deprecated/obsolete
            "no-obsolete-elements": "error",
            "no-obsolete-attributes": "error",

            // Accessibility / best-practice basics (some overlap with Nu)
            "hidden-focusable": "warn",
            "meta-refresh": "warn",

            // Linter-style rules that are not spec-critical — keep conservative defaults
            "no-trailing-whitespace": "off", // stylistic, not W3C spec
            "no-inline-style": "off", // not part of W3C conformance

            // Link checks: can be enabled if you want link validation during local runs
            // "no-broken-links": "error" // enable only if your environment supports link checking
        },
    });

    // const htmlvalidate = new HtmlValidate();

    let testtt;
    testtt = html.replace(/id=":([^"]+):"/g, 'id="react-$1"');
    testtt = testtt.replace(/aria-labelledby=":([^"]+):"/g, 'aria-labelledby="react-$1"');

    const report = htmlvalidate.validateStringSync(testtt);

    // const config = htmlvalidate.getConfigFor(html);

    // console.log(JSON.stringify(config));

    // console.log("ReULSLT", report);
    const errors = report.results.flatMap((result) =>
        result.messages.map((msg) => `[${msg.line}:${msg.column}] ${msg.message} (${msg.ruleId})`),
    );

    return errors;
}
