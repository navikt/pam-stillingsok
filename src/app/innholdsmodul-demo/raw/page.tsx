import { Box, Heading, HStack, Link, Tag, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/esm/primitives/page";
import rawJson from "docs/karriere-api-eksempel.json";
import type { Metadata } from "next";
import InnholdsmodulRenderer from "@/app/innholdsmodul-demo/_components/InnholdsmodulRenderer";
import SituationsModule from "@/app/innholdsmodul-demo/_components/modules/SituationsModule";
import { parseKarriereApiResponse } from "@/app/innholdsmodul-demo/_data/karriereApiParser";
import type { KarriereApiResponse } from "@/app/innholdsmodul-demo/_data/types";

export const metadata: Metadata = {
    title: "Innholdsmodul-demo - rådata",
    robots: "noindex",
};

export default function InnholdsmodulDemoRawPage() {
    const innholdsmodul = parseKarriereApiResponse(rawJson as unknown as KarriereApiResponse);

    return (
        <PageBlock width="2xl" gutters className="mt-5 mb-12">
            <Box paddingBlock={{ xs: "space-16", md: "space-24" }} paddingInline={{ xs: "space-16", md: "space-40" }}>
                <VStack gap="space-2" as="header">
                    <HStack gap="space-2" align="center">
                        <Tag variant="warning" size="small" style={{ alignSelf: "flex-start" }}>
                            Demo — rådata fra API-eksempel
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
