import React, { ReactElement, useEffect, useRef } from "react";
import { BodyLong, Button, LocalAlert, Stack } from "@navikt/ds-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Failure(): ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    const backUrl = usePathname().replace("/meld-interesse", "");

    return (
        <LocalAlert status="error" className="mb-4 mt-4" role="alert">
            <LocalAlert.Header className="padding-0-75">
                <LocalAlert.Title>
                    <BodyLong>Det oppstod en feil!</BodyLong>
                </LocalAlert.Title>
            </LocalAlert.Header>
            <LocalAlert.Content>
                <BodyLong spacing>Det oppstod en feil ved melding av interesse. Vennligst prøv igjen senere.</BodyLong>
                <Stack justify="space-between">
                    <Button variant="primary" as={Link} href={backUrl}>
                        Gå tilbake til stillingen
                    </Button>
                    <Button variant="secondary" as={Link} href="/muligheter">
                        Søk etter flere muligheter
                    </Button>
                </Stack>
            </LocalAlert.Content>
        </LocalAlert>
    );
}

export default Failure;
