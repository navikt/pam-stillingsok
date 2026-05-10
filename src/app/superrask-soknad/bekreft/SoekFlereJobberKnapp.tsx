"use client";

import { Button } from "@navikt/ds-react";
import Link from "next/link";

function SoekFlereJobberKnapp() {
    return (
        <Button variant="secondary" as={Link} prefetch={false} href="/stillinger">
            Søk etter flere jobber
        </Button>
    );
}

export default SoekFlereJobberKnapp;
