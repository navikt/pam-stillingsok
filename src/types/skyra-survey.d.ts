import type React from "react";

declare global {
    interface SkyraSurveyElement extends HTMLElement {
        slug?: string;
    }

    interface HTMLElementTagNameMap {
        "skyra-survey": SkyraSurveyElement;
    }
}

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "skyra-survey": React.DetailedHTMLProps<React.HTMLAttributes<SkyraSurveyElement>, SkyraSurveyElement> & {
                slug: string;
                consent?: string;
                inline?: boolean | "";
            };
        }
    }
}

export {};
