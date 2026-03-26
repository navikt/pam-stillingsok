import type {} from "@navikt/core/react/types/theme";
declare module "@navikt/ds-react/types/theme" {
    export interface CustomAkselColor {
        "ung-link-card-blue": never;
    }
}
declare module "react" {
    interface HTMLAttributes {
        /**
         * Styler Aksel LinkCard
         * Oppdaterer tokens for bakgrunn, tekst og border-radius
         */
        "data-ung-link-card"?: "blue" | "bar" | "baz";
    }
}
