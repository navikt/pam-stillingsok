import React, { ReactElement } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

export default function NewFiltersMessage(): ReactElement {
    return (
        <>
            Vi tester ut nye filtre og jobber med å gjøre dem mer nøyaktige. Vi bruker kunstig intelligens (KI) til å
            hjelpe oss med dette. Hvordan opplever du søkeresultatet?{" "}
            <AkselNextLink href="https://surveys.hotjar.com/8eedca7e-3fae-4852-8d96-4c9c80424cdc">
                Skriv en kort tilbakemelding
            </AkselNextLink>
        </>
    );
}
