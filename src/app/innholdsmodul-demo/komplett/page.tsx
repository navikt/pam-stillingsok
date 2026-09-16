import { Alert, Box, Heading, HStack, Link, Tag, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/esm/primitives/page";
import type { Metadata } from "next";
import KomplettRenderer from "@/app/innholdsmodul-demo/_components/KomplettRenderer";
import SituationsModule from "@/app/innholdsmodul-demo/_components/modules/SituationsModule";
import { komplettMockData } from "@/app/innholdsmodul-demo/_data/speculativeMockData";

export const metadata: Metadata = {
    title: "Komplett innholdsmodul-demo",
    robots: "noindex",
};

export default function KomplettDemoPage() {
    return (
        <PageBlock width="2xl" gutters className="mt-5 mb-12">
            <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
                <VStack gap="space-6" as="header">
                    <HStack gap="space-2" align="center" wrap>
                        <Tag variant="error" size="small" style={{ alignSelf: "flex-start" }}>
                            FIKTIV DATA — spekulatibve modultyper
                        </Tag>
                        <Link href="/innholdsmodul-demo">← Tilbake til bekreftet demo</Link>
                        <Link href="/innholdsmodul-demo/ny">→ Til accordion API v2</Link>
                    </HStack>

                    <Alert variant="warning" size="small">
                        Spekulatibve moduler (rød badge) er basert på beskrivelser — feltnavn og API-format er ukjent og
                        vil endres når dokumentasjon foreligger.
                    </Alert>

                    <Heading size="xlarge" level="1" spacing>
                        {komplettMockData.title}
                    </Heading>
                    <SituationsModule situations={komplettMockData.situations} />
                </VStack>

                <Box paddingBlock="space-16">
                    <KomplettRenderer paragraphs={komplettMockData.paragraphs} />
                </Box>
            </Box>
        </PageBlock>
    );
}
