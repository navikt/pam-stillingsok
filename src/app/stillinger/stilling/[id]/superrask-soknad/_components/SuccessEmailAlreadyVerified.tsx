"use client";

import { BodyLong, Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { useEffect, useRef } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { getSoknadSendtTitle } from "@/app/_common/utils/getTitle";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";
import SoekFlereJobberKnapp from "@/app/superrask-soknad/bekreft/SoekFlereJobberKnapp";

type SuccessEmailAlreadyVerifiedProps = {
    email: string;
    employerName?: string;
};

// Vises bare for innloggede brukere som har verifisert e-postadressen tidligere.
function SuccessEmailAlreadyVerified({ email, employerName }: SuccessEmailAlreadyVerifiedProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        ref.current?.focus();
    }, []);

    const soknadSendtTitle = getSoknadSendtTitle(employerName);

    return (
        <VStack>
            <Heading level="1" size="large" spacing ref={ref} tabIndex={-1}>
                {soknadSendtTitle}
            </Heading>
            <BodyLong>
                Vi har sendt en bekreftelse til{" "}
                <BodyLong as="span" weight="semibold">
                    {email}
                </BodyLong>
                .
            </BodyLong>
            <Box marginBlock="space-32 space-48">
                <VStack gap="space-8">
                    <Heading level="2" size="medium">
                        Hva skjer nå?
                    </Heading>
                    <VStack gap="space-32">
                        <BodyLong>
                            Bedriften vil vurdere din søknad og ta kontakt dersom de synes du passer for jobben. Du får
                            beskjed på e-post så fort bedriften har gjort en vurdering.
                        </BodyLong>
                        <BodyLong>
                            Du finner søknaden under{" "}
                            <AkselNextLink inlineText href="/superrask-soknad/mine-soknader">
                                Mine søknader
                            </AkselNextLink>
                            , og kan trekke den der.
                        </BodyLong>
                        <HStack>
                            <SoekFlereJobberKnapp />
                        </HStack>
                    </VStack>
                </VStack>
            </Box>
            <GiveFeedback />
        </VStack>
    );
}

export default SuccessEmailAlreadyVerified;
