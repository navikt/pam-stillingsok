"use client";

import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import React, { ReactElement, useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import App from "@/app/App";
import { localFont } from "@/app/_common/font/loadFont";
import { CookieBannerUtils } from "@navikt/arbeidsplassen-react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }): ReactElement {
    const [userActionTaken, setUserActionTaken] = useState<boolean>(false);
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    useEffect(() => {
        setUserActionTaken(CookieBannerUtils.getUserActionTakenValue() ?? false);
    }, []);

    return (
        <html lang="no">
            <body data-theme="arbeidsplassen" className={localFont.className}>
                <App userActionTaken={userActionTaken}>
                    <section className="container-small mt-16 mb-16" aria-live="assertive">
                        <VStack align="center">
                            <WorriedFigure className="mb-8" />
                            <Heading level="1" size="large" className="text-center" spacing>
                                Her gikk det dessverre galt
                            </Heading>
                            <BodyLong className="text-center">
                                Vi beklager det inntrufne. Vennligst prøv å laste siden på nytt, eller prøv igjen
                                senere.
                            </BodyLong>
                        </VStack>
                    </section>
                </App>
            </body>
        </html>
    );
}
