"use client";

import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import React, { ReactElement, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { PageBlock } from "@navikt/ds-react/Page";

export default function GlobalError({ error }: { error: Error & { digest?: string } }): ReactElement {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <PageBlock width="md" gutters className="mt-16 mb-16" aria-live="assertive">
            <VStack align="center">
                <WorriedFigure className="mb-8" />
                <Heading level="1" size="large" className="text-center" spacing>
                    Her gikk det dessverre galt
                </Heading>
                <BodyLong className="text-center">
                    Vi beklager det inntrufne. Vennligst prøv å laste siden på nytt, eller prøv igjen senere.
                </BodyLong>
            </VStack>
        </PageBlock>
    );
}
