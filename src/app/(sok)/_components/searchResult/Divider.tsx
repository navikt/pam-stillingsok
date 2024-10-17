import React, { ReactElement } from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

interface DividerProps {
    index: number;
    indexOfLastWithScoreAboveThreshold: number;
}
export default function Divider({ index, indexOfLastWithScoreAboveThreshold }: DividerProps): ReactElement | null {
    const searchParams = useSearchParams();

    if (indexOfLastWithScoreAboveThreshold !== 0 && indexOfLastWithScoreAboveThreshold === index) {
        return (
            <Box
                background="surface-alt-1-subtle"
                className="mt-16"
                paddingBlock="4"
                paddingInline="4"
                borderRadius="small"
            >
                <Heading level="3" size="small" className="mb-05">
                    Flere søketreff som kan være relevante
                </Heading>
                <BodyShort>
                    Annonsene under ga delvis treff på &laquo;
                    {searchParams.getAll(QueryNames.SEARCH_STRING).join(", ")}
                    &raquo;
                </BodyShort>
            </Box>
        );
    }

    return null;
}
