import { BodyLong, Button, Heading, HStack } from "@navikt/ds-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";

type WithdrawApplicationSuccessProps = {
    from?: string;
};

function WithdrawApplicationSuccess({ from }: WithdrawApplicationSuccessProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const showReturnToMineSoknader = from === "mine-soknader";

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.focus();
        }
    }, []);
    return (
        <>
            <Heading level="1" size="large" spacing ref={titleRef} tabIndex={-1} aria-live="polite" role="alert">
                Din søknad er nå trukket
            </Heading>

            <BodyLong className="mb-10">
                Informasjonen du oppgav i din søknad er slettet. Dersom du angrer på at du trakk søknaden, kan du søke
                på nytt.
            </BodyLong>
            <GiveFeedback />
            <HStack gap="space-16">
                {showReturnToMineSoknader && (
                    <Button variant="secondary" as={Link} prefetch={false} href="/superrask-soknad/mine-soknader">
                        Tilbake til mine søknader
                    </Button>
                )}
                <Button variant="secondary" as={Link} prefetch={false} href="/stillinger">
                    Se ledige stillinger
                </Button>
            </HStack>
        </>
    );
}

export default WithdrawApplicationSuccess;
