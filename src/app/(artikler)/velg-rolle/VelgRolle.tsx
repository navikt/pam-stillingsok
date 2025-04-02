"use client";

import { Heading, LinkPanel, Stack } from "@navikt/ds-react";

export default function VelgRolle() {
    return (
        <div className="container-medium mt-5 mb-24">
            <Heading size="xlarge" level="1" className="mb-8">
                Er du jobbsøker eller arbeidsgiver?
            </Heading>
            <Stack direction={{ xs: "column", md: "row" }} gap="4">
                <LinkPanel href="../oauth2/login?redirect=/min-side" className="arb-link-panel-secondary flex-1">
                    <LinkPanel.Title>Jeg er jobbsøker</LinkPanel.Title>
                    <LinkPanel.Description>Logg inn på min side</LinkPanel.Description>
                </LinkPanel>

                <LinkPanel
                    href="../oauth2/login?redirect=/stillingsregistrering"
                    className="arb-link-panel-secondary flex-1"
                >
                    <LinkPanel.Title>Jeg er arbeidsgiver</LinkPanel.Title>
                    <LinkPanel.Description>Logg inn på min bedriftsside</LinkPanel.Description>
                </LinkPanel>
            </Stack>
        </div>
    );
}
