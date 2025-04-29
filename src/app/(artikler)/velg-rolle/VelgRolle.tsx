import { Heading, Stack } from "@navikt/ds-react";
import { LinkPanel, LinkPanelTitle, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";

export default function VelgRolle() {
    return (
        <div className="container-medium mt-5 mb-24">
            <Heading size="xlarge" level="1" className="mb-8">
                Er du jobbsøker eller arbeidsgiver?
            </Heading>
            <Stack direction={{ xs: "column", md: "row" }} gap="4">
                <LinkPanel href="/oauth2/login?redirect=/min-side" className="arb-link-panel-secondary flex-1">
                    <LinkPanelTitle>Jeg er jobbsøker</LinkPanelTitle>
                    <LinkPanelDescription>Logg inn på min side</LinkPanelDescription>
                </LinkPanel>

                <LinkPanel
                    href="/oauth2/login?redirect=/stillingsregistrering"
                    className="arb-link-panel-secondary flex-1"
                >
                    <LinkPanelTitle>Jeg er arbeidsgiver</LinkPanelTitle>
                    <LinkPanelDescription>Logg inn på min bedriftsside</LinkPanelDescription>
                </LinkPanel>
            </Stack>
        </div>
    );
}
