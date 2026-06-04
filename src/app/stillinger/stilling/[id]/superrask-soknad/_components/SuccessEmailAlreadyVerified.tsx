"use client";

import { BodyLong, Button, Heading, HStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import Link from "next/link";
import { useEffect, useRef, type JSX } from "react";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";
import SoekFlereJobberKnapp from "@/app/superrask-soknad/bekreft/SoekFlereJobberKnapp";

function SuccessEmailAlreadyVerified(): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        ref.current?.focus();
    }, []);

    return (
        <div className="mb-16 mt-16">
            <PageBlock width="text" gutters>
                <Heading level="1" size="large" spacing ref={ref} tabIndex={-1} aria-live="polite" role="alert">
                    Søknaden er sendt til arbeidsgiver
                </Heading>
                <BodyLong spacing>
                    Du vil straks få en bekreftelse på din e-post. Ønsker du å trekke din søknad, finner du informasjon
                    om dette i e-posten.
                </BodyLong>
                <Heading level="2" spacing size="medium">
                    Hva skjer nå?
                </Heading>
                <BodyLong className="mb-8">
                    Bedriften vil vurdere din søknad og ta kontakt dersom de synes du passer for jobben. Du får beskjed
                    på e-post så fort bedriften har gjort en vurdering.
                </BodyLong>
                <GiveFeedback />
                <HStack gap="space-16">
                    <Button variant="secondary" as={Link} prefetch={false} href="/superrask-soknad/mine-soknader">
                        Gå til mine søknader
                    </Button>
                    <SoekFlereJobberKnapp />
                </HStack>
            </PageBlock>
        </div>
    );
}

export default SuccessEmailAlreadyVerified;
