import type React from "react";

declare global {
    // Selve element-typen (kan brukes i refs, querySelector osv.)
    interface SkyraSurveyElement extends HTMLElement {
        slug?: string;
    }

    // Gir bedre DOM-typing for querySelector("skyra-survey") osv.
    interface HTMLElementTagNameMap {
        "skyra-survey": SkyraSurveyElement;
    }

    // Utvid JSX med custom tag + props
    namespace JSX {
        interface IntrinsicElements {
            "skyra-survey": React.DetailedHTMLProps<React.HTMLAttributes<SkyraSurveyElement>, SkyraSurveyElement> & {
                slug: string; // påkrevd attributt/prop
                consent?: string; // valgfritt attributt/prop
            };
        }
    }
}

export {};
