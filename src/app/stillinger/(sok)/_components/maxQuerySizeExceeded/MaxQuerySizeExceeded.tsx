import React from "react";
import { NotFound } from "@navikt/arbeidsplassen-react";
import { VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { NextButtonLink } from "@/app/_common/components/NextButtonLink/NextButtonLink";

interface MaxQuerySizeExceededProps {
    goBackToSearchUrl: string;
}

export default function MaxQuerySizeExceeded({ goBackToSearchUrl }: MaxQuerySizeExceededProps) {
    return (
        <PageBlock width="md" gutters className=" mt-12 mb-24">
            <VStack align="center" gap="space-32">
                <NotFound
                    className=""
                    title="Du har nådd maks antall annonser for ditt søk"
                    text="Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser."
                />
                <NextButtonLink href={goBackToSearchUrl}>Gå tilbake til søket</NextButtonLink>
            </VStack>
        </PageBlock>
    );
}
