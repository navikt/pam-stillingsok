import React, { useEffect, useRef } from "react";
import { BodyLong, Button, Heading, Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";

function Success() {
    const ref = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <div className="container-small mt-12 mb-24 text-center">
            <Heading
                level="1"
                ref={ref}
                size="large"
                tabIndex={-1}
                spacing
                aria-live="polite"
                role="alert"
                className="no-focus-outline"
            >
                Takk for tilbakemeldingen din ✨
            </Heading>
            <BodyLong spacing>Har du flere tanker eller forslag hører vi gjerne fra deg!</BodyLong>
            <BodyLong spacing>
                <AkselLink href="https://surveys.hotjar.com/e00d7167-285f-43ed-b14f-d65db5910559">
                    Klikk her for å dele dine idéer med oss
                </AkselLink>
            </BodyLong>
            <Button variant="primary" as={Link} href="/">
                Tilbake til søket
            </Button>
        </div>
    );
}

export default Success;
