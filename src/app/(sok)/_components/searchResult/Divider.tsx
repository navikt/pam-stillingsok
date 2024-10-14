import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, Hide, HStack } from "@navikt/ds-react";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import joinStringWithSeperator from "@/app/_common/utils/joinStringWithSeperator";
import DetectiveIcon from "@/app/(sok)/_components/icons/DetectiveIcon";

interface DividerProps {
    index: number;
    indexOfLastWithScoreAboveThreshold: number;
}
export default function Divider({ index, indexOfLastWithScoreAboveThreshold }: DividerProps): ReactElement {
    const query = useQuery();

    if (indexOfLastWithScoreAboveThreshold !== 0 && indexOfLastWithScoreAboveThreshold === index) {
        return (
            <Box padding="2 4" borderRadius="small" background="surface-alt-1-subtle" className="mt-12">
                <HStack wrap={false} justify="space-between" align="center" gap="4">
                    <Box>
                        <Heading level="3" size="small" className="mb-05">
                            Mindre relevante treff
                        </Heading>

                        <BodyShort>
                            Treffene under nevner likevel <b>{joinStringWithSeperator(query.getAll("q"), "eller")}</b> i
                            annonseteksten
                        </BodyShort>
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
