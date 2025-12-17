import React from "react";
import Link from "next/link";
import { NotFound } from "@navikt/arbeidsplassen-react";
import { Button, VStack } from "@navikt/ds-react";

interface MaxQuerySizeExceededProps {
    goBackToSearchUrl: string;
}

export default function MaxQuerySizeExceeded({ goBackToSearchUrl }: MaxQuerySizeExceededProps) {
    return (
        <VStack align="center" gap="8" className="container-large mt-12 mb-24">
            <NotFound
                title="Du har nådd maks antall annonser for ditt søk"
                text="Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser."
            />
            <Button variant="primary" as={Link} href={goBackToSearchUrl}>
                Gå tilbake til søket
            </Button>
        </VStack>
    );
}
