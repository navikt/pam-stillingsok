import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, Heading } from "@navikt/ds-react";
import Link from "next/link";

function Failure(): ReactElement {
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
                Det oppstod en feil!
            </Heading>
            <BodyLong spacing>Det oppstod en feil ved melding av interesse. Vennligst prøv igjen senere.</BodyLong>
            <Button variant="secondary" as={Link} href="/muligheter">
                Søk etter flere muligheter
            </Button>
        </>
    );
}

export default Failure;
