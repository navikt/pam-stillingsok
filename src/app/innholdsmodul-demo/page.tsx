import { Box, Heading, HStack, Link, Tag, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/esm/primitives/page";
import type { Metadata } from "next";
import InnholdsmodulRenderer from "@/app/innholdsmodul-demo/_components/InnholdsmodulRenderer";
import SituationsModule from "@/app/innholdsmodul-demo/_components/modules/SituationsModule";
import { parseKarriereApiResponse } from "@/app/innholdsmodul-demo/_data/karriereApiParser";
import { mockKarriereApiResponse } from "@/app/innholdsmodul-demo/_data/mockData";

export const metadata: Metadata = {
    title: "Innholdsmodul-demo",
    robots: "noindex",
};

export default function InnholdsmodulDemoPage() {
    const innholdsmodul = parseKarriereApiResponse(mockKarriereApiResponse);

    return (
        <PageBlock width="2xl" gutters className="mt-5 mb-12">
            <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
                <VStack gap="space-2" as="header">
                    <HStack gap="space-2" align="center">
                        <Tag variant="info" size="small" style={{ alignSelf: "flex-start" }}>
                            Demo — simulert API-data
                        </Tag>
                        <Link href="/innholdsmodul-demo/raw">→ Til rådata-variant</Link>
                        <Link href="/innholdsmodul-demo/ny">→ Til accordion API v2</Link>
                        <Link href="/innholdsmodul-demo/komplett">→ Til komplett demo</Link>
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
