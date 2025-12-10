"use client";
import React from "react";
import NextLink from "next/link";
import { Button } from "@navikt/ds-react";

export default function StillingerLinkKnapp() {
    return (
        <Button variant="primary" as={NextLink} href="/stillinger">
            Gå til ledige stillinger
        </Button>
    );
}
