"use client";

import { Bleed, BodyLong, Box, Button, Heading, Stack } from "@navikt/ds-react";
import React, { useContext } from "react";
import ArticleWrapper from "@/app/_common/article/ArticleWrapper";
import ArticleBleedImage from "@/app/_common/article/ArticleBleedImage";
import {
    AuthenticationContext,
    MuligheterAccessStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import { notFound } from "next/navigation";
import styles from "./omMuligheter.module.css";
import Link from "next/link";
import { PageBlock } from "@navikt/ds-react/Page";
import { cn } from "@/app/_common/utils/cn";

export default function OmMuligheter() {
    const { muligheterAccessStatus } = useContext(AuthenticationContext);

    if (
        muligheterAccessStatus === MuligheterAccessStatus.NOT_FETCHED ||
        muligheterAccessStatus === MuligheterAccessStatus.IS_FETCHING
    ) {
        return <LoadingPage />;
    } else if (
        muligheterAccessStatus === MuligheterAccessStatus.FAILURE ||
        muligheterAccessStatus === MuligheterAccessStatus.MULIGHETER_NO_ACCESS
    ) {
        notFound();
    }

    return (
        <ArticleWrapper lang={"nb"}>
            <Heading size="xlarge" level="1" spacing>
                Nye muligheter hos Nav
            </Heading>
            <BodyLong size="large" spacing>
                En enklere måte å komme i kontakt med arbeidsgivere
            </BodyLong>

            <ArticleBleedImage
                src="/images/jobbmulighet.jpg"
                alt="En kvinne som sitter i sofaen med en laptop på fanget."
            />

            <Heading size="small" level="2" spacing>
                Nye jobbmuligheter for deg
            </Heading>
            <BodyLong spacing>
                Vi har gjort det enklere å finne jobber som kan passe for deg. Som registrert jobbsøker hos Nav, kan du
                få tilgang til stillinger som kun vises til registrerte jobbsøkere. Dette gir deg en ekstra sjanse til å
                vise interesse for en stilling, og komme i kontakt med arbeidsgivere.
            </BodyLong>
            <Heading size="small" level="2" spacing>
                Slik finner du stillingene
            </Heading>
            <BodyLong spacing>
                Når du ser etter jobber på arbeidsplassen.no, vil disse stillingene ligge under en egen fane og være
                merket <span className="aksel-typo--semibold">«kun for registrerte jobbsøkere»</span>, slik at du lett
                kjenner dem igjen. Denne fanen vises kun dersom du er logget inn på arbeidsplassen.no.
            </BodyLong>
            <Heading size="small" level="2" spacing>
                Hva skjer når du viser interesse?
            </Heading>
            <BodyLong spacing>
                Når du viser interesse for en stilling, starter du dialog med veilederen din på nav.no. Dersom du er
                aktuell for stillingen vil du få spørsmål om å dele CV med arbeidsgiver.
            </BodyLong>

            <Bleed marginInline="full" asChild className={cn(styles["om-muligheter-kriterier-container"], "mb-8")}>
                <Box paddingBlock={"space-44"}>
                    <PageBlock as="section" gutters width="text">
                        <Heading size="small" level="2" spacing>
                            Disse stillingene vises ikke for alle
                        </Heading>
                        <BodyLong>
                            Disse stillingene vises ikke hvis du har adresseskjerming, har status som egen ansatt, eller
                            deltar i kommunalt kvalifiseringsprogram (KVP).
                        </BodyLong>
                    </PageBlock>
                </Box>
            </Bleed>

            <Stack justify="center">
                <Button variant="primary" as={Link} href={"/muligheter"} className={styles["til-muligheter-button"]}>
                    <span className={styles["om-muligheter-button-text"]}>Se dine jobbmuligheter</span>
                </Button>
            </Stack>
        </ArticleWrapper>
    );
}
