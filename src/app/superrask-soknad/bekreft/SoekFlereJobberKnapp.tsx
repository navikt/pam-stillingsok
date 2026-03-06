"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@navikt/ds-react";

function SoekFlereJobberKnapp() {
    return (
        <Button variant="secondary" as={Link} prefetch={false} href="/stillinger">
            Søk etter flere jobber
        </Button>
    );
}

export default SoekFlereJobberKnapp;
