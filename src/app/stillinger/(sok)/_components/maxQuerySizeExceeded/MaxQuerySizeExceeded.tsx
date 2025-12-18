import React from "react";
import Link from "next/link";
import { NotFound } from "@navikt/arbeidsplassen-react";
import { Button, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";

interface MaxQuerySizeExceededProps {
    goBackToSearchUrl: string;
}

export default function MaxQuerySizeExceeded({ goBackToSearchUrl }: MaxQuerySizeExceededProps) {
    return (
        <PageBlock width="md" gutters className=" mt-12 mb-24">
            <VStack align="center" gap="8">
                <NotFound
                    title="Du har nådd maks antall annonser for ditt søk"
                    text="Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser."
                />
                <Button variant="primary" as={Link} href={goBackToSearchUrl}>
                    Gå tilbake til søket
                </Button>
            </VStack>
        </PageBlock>
    );
}
