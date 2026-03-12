import { Heading, Loader } from "@navikt/ds-react";
import React from "react";

export default function SimilarAdsFallback() {
    return (
        <section aria-busy="true" aria-live="polite">
            <Heading level="2" size="large" spacing>
                Lignende annonser
            </Heading>
            <Loader size="xlarge" title="Laster lignende annonser" />
        </section>
    );
}
