import { Box, Heading, HStack, Link, Tag, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/esm/primitives/page";
import rawJson from "docs/karriere-api-nytt-eksempel.json";
import type { Metadata } from "next";
import InnholdsmodulRenderer from "@/app/innholdsmodul-demo/_components/InnholdsmodulRenderer";
import SituationsModule from "@/app/innholdsmodul-demo/_components/modules/SituationsModule";
import { parseKarriereApiResponse } from "@/app/innholdsmodul-demo/_data/karriereApiParser";
import type { KarriereApiResponse } from "@/app/innholdsmodul-demo/_data/types";

export const metadata: Metadata = {
    title: "Innholdsmodul-demo — accordion API v2",
    robots: "noindex",
};

export default function InnholdsmodulDemoNyPage() {
    const innholdsmodul = parseKarriereApiResponse(rawJson as unknown as KarriereApiResponse);

    return (
        <PageBlock width="2xl" gutters className="mt-5 mb-12">
            <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
                <VStack gap="space-2" as="header">
                    <HStack gap="space-2" align="center">
                        <Tag variant="alt3" size="small" style={{ alignSelf: "flex-start" }}>
                            Demo — accordion API v2 (paragraph--accordion)
                        </Tag>
                        <Link href="/innholdsmodul-demo">← Til mock-variant</Link>
                    </HStack>
                    <Heading size="xlarge" level="1" spacing>
                        {innholdsmodul.title}
                    </Heading>
                    <SituationsModule situations={innholdsmodul.situations} />
                </VStack>

                <Box paddingBlock="space-16">
                    <InnholdsmodulRenderer paragraphs={innholdsmodul.paragraphs} />
                </Box>
            </Box>
        </PageBlock>
    );
}
