"use client";

import { BodyLong, Heading, VStack } from "@navikt/ds-react";
import { WorriedFigure } from "@navikt/arbeidsplassen-react";
import React, { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import interLocalFont from "next/font/local";
import App from "@/app/App";

const myFont = interLocalFont({
    variable: "--font-inter",
    src: "../../public/font/InterVariable.ttf",
    weight: "100 900",
    display: "swap",
});
export default function Error({ error }) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html lang="no">
            <body data-theme="arbeidsplassen" className={myFont.className}>
                <App>
                    <section className="container-small mt-16 mb-16">
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
