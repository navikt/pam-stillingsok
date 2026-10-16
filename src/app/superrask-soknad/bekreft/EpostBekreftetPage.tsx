"use client";

import { BodyLong, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import Link from "next/link";
import { type JSX, useEffect, useRef } from "react";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";
import SoekFlereJobberKnapp from "@/app/superrask-soknad/bekreft/SoekFlereJobberKnapp";

type EpostBekreftetPageProps = {
    applicationSentByLoggedInApplicant: boolean;
};

export default function EpostBekreftetPage({
    applicationSentByLoggedInApplicant,
}: EpostBekreftetPageProps): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        ref.current?.focus();
    }, []);

    return (
        <Box asChild marginBlock="space-48 space-32">
            <PageBlock width="md" gutters>
                <Heading level="1" size="large" spacing ref={ref} tabIndex={-1}>
                    Søknaden er sendt til arbeidsgiver
                </Heading>
                <BodyLong>
                    Du vil straks få en bekreftelse på din e-post. Ønsker du å trekke din søknad, finner du informasjon
                    om dette i e-posten.
                </BodyLong>
                <Box marginBlock="space-32 space-0">
                    <Heading level="2" spacing size="medium">
                        Hva skjer nå?
                    </Heading>
                    <VStack gap="space-32">
                        <BodyLong>
                            Bedriften vil vurdere din søknad og ta kontakt dersom de synes du passer for jobben. Du får
                            beskjed på e-post så fort bedriften har gjort en vurdering.
                        </BodyLong>
                        <HStack gap="space-16">
                            {applicationSentByLoggedInApplicant && (
                                <Button
                                    variant="secondary"
                                    as={Link}
                                    prefetch={false}
                                    href="/superrask-soknad/mine-soknader"
                                >
                                    Gå til mine søknader
                                </Button>
                            )}
                            <SoekFlereJobberKnapp />
                        </HStack>
                    </VStack>
                    <GiveFeedback />
                </Box>
            </PageBlock>
        </Box>
    );
}
