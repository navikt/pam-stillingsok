import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";
import GiveFeedback from "@/app/stillinger/stilling/[id]/superrask-soknad/_components/GiveFeedback";

function Success({ email }: { email: string }): ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <>
            <Heading level="1" size="large" spacing ref={ref} tabIndex={-1} aria-live="polite" role="alert">
                Verifiser eposten din for å sende søknaden
            </Heading>
            <BodyLong spacing>
                Vi har sendt en lenke til {email}. Klikk på lenken for å sende søknaden. Lenken er gyldig i 24 timer.
            </BodyLong>
            <Heading level="2" spacing size="medium">
                Fikk du ikke e-posten?
            </Heading>
            <Button variant="secondary" as={Link} href="/todo">
                Send lenken på nytt
            </Button>

            <GiveFeedback />
        </>
    );
}

export default Success;
