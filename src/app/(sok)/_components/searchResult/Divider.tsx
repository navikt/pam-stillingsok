import React, { ReactElement } from "react";
import { BodyShort, Box, Button, Heading, Hide, HStack } from "@navikt/ds-react";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import joinStringWithSeperator from "@/app/_common/utils/joinStringWithSeperator";
import DetectiveIcon from "@/app/(sok)/_components/icons/DetectiveIcon";

interface DividerProps {
    index: number;
    indexOfLastWithScoreAboveThreshold: number;
}
export default function Divider({ index, indexOfLastWithScoreAboveThreshold }: DividerProps): ReactElement | null {
    const query = useQuery();

    if (indexOfLastWithScoreAboveThreshold !== 0 && indexOfLastWithScoreAboveThreshold === index) {
        return (
            <Box paddingInline="4" paddingBlock="2" borderRadius="small" background="surface-subtle" className="mt-12">
                <HStack wrap={false} justify="space-between" align="center" gap="4">
                    <Box>
                        <Heading level="3" size="small" className="mb-05">
                            Viser bare mest relevante treff
                        </Heading>

                        <BodyShort spacing>
                            13 flere annonser nevner <b>{joinStringWithSeperator(query.getAll("q"), "eller")}</b> i
                            annonseteksten
                        </BodyShort>
                        <Button variant="secondary-neutral" size="small">
                            Søk på nytt med alle treff
                        </Button>
                    </Box>
                    <Hide below="md">
                        <Box paddingInline="4">
                            <DetectiveIcon />
                        </Box>
                    </Hide>
                </HStack>
            </Box>
        );
    }

    return null;
}
