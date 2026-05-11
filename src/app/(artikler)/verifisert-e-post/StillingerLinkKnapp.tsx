"use client";
import { Button } from "@navikt/ds-react";
import NextLink from "next/link";

export default function StillingerLinkKnapp() {
    return (
        <Button variant="primary" as={NextLink} prefetch={false} href="/stillinger">
            Gå til ledige stillinger
        </Button>
    );
}
