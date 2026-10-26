"use client";

import { BodyLong, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { useEffect, useRef } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { getSoknadSendtTitle } from "@/app/_common/utils/getTitle";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";
import SoekFlereJobberKnapp from "@/app/superrask-soknad/bekreft/SoekFlereJobberKnapp";

type EpostBekreftetPageProps = {
    wasSubmittedByLoggedInApplicant: boolean;
    email?: string; //TODO ARB-337: Gjøre obligatorisk etter backend-endringer.
    employerName?: string;
};

// Vises kun for innloggede brukere med ny eller ukjent epost eller anonyme brukere.
function EpostBekreftetPage({ wasSubmittedByLoggedInApplicant, email, employerName }: EpostBekreftetPageProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        ref.current?.focus();
    }, []);

    // TODO ARB-337: Sørge for at både e-post og employerName også sendes fra backend
    const soknadSendtTitle = getSoknadSendtTitle(employerName);

    return (
        <Box asChild marginBlock="space-48 space-32">
            <PageBlock width="md" gutters>
                <VStack>
                    <Heading level="1" size="large" spacing ref={ref} tabIndex={-1}>
                        {soknadSendtTitle}
                    </Heading>
                    <BodyLong>
                        Vi har sendt en bekreftelse til{" "}
                        {email ? (
                            <BodyLong as="span" weight="semibold">
                                {email}
                            </BodyLong>
                        ) : (
                            "din e-post"
                        )}
                        .
                    </BodyLong>
                    <Box marginBlock="space-32 space-48">
                        <VStack gap="space-8">
                            <Heading level="2" size="medium">
                                Hva skjer nå?
                            </Heading>
                            <VStack gap="space-32">
                                <BodyLong>
                                    Bedriften vil vurdere din søknad og ta kontakt dersom de synes du passer for jobben.
                                    Du får beskjed på e-post så fort bedriften har gjort en vurdering.
                                </BodyLong>
                                {wasSubmittedByLoggedInApplicant ? (
                                    <BodyLong>
                                        Du finner søknaden under{" "}
                                        <AkselNextLink inlineText href="/superrask-soknad/mine-soknader">
                                            Mine søknader
                                        </AkselNextLink>
                                        , og kan trekke den der.
                                    </BodyLong>
                                ) : (
                                    <BodyLong>
                                        Vil du trekke søknaden, finner du en lenke til det i bekreftelsen på epost.
                                    </BodyLong>
                                )}
                                <HStack>
                                    <SoekFlereJobberKnapp />
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
                    <GiveFeedback />
                </VStack>
            </PageBlock>
        </Box>
    );
}

export default EpostBekreftetPage;
