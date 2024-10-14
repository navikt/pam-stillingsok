import React, { ReactElement } from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import joinStringWithSeperator from "@/app/_common/utils/joinStringWithSeperator";

interface DividerProps {
    index: number;
    indexOfLastWithScoreAboveThreshold: number;
}
export default function Divider({ index, indexOfLastWithScoreAboveThreshold }: DividerProps): ReactElement | null {
    const query = useQuery();

    if (indexOfLastWithScoreAboveThreshold !== 0 && indexOfLastWithScoreAboveThreshold === index) {
        return (
            <Box background="surface-alt-1-subtle" className="mt-16" paddingBlock="4" paddingInline="2">
                <Heading level="3" size="medium" className="mb-05">
                    Mindre relevante treff
                </Heading>

                <BodyShort>
                    Treffene er ikke like relevante, men nevner likevel{" "}
                    <b>{joinStringWithSeperator(query.getAll("q"), "eller")}</b> i annonseteksten
                </BodyShort>
            </Box>
        );
    }

    return null;
}
