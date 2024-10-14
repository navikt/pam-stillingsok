import React, { ReactElement } from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";
import useQuery from "@/app/(sok)/_components/QueryProvider";

interface DividerProps {
    index: number;
    score: number;
    indexOfLastWithScoreAboveThreshold: number;
}
export default function Divider({ index, score, indexOfLastWithScoreAboveThreshold }: DividerProps): ReactElement {
    const query = useQuery();
    const scoreThreshold = 2;

    return (
        <>
            {index === 0 && score >= scoreThreshold && (
                <Box padding="2" borderRadius="small" background="surface-subtle">
                    <Heading level="2" size="small">
                        Beste treff
                    </Heading>
                </Box>
            )}
            {indexOfLastWithScoreAboveThreshold === index && (
                <Box
                    padding="2"
                    borderRadius="medium"
                    background="surface-subtle"
                    className={indexOfLastWithScoreAboveThreshold !== 0 ? "mt-16" : ""}
                >
                    <Heading level="2" size="small" className="mb-05">
                        Mindre relevante treff
                    </Heading>
                    <BodyShort>
                        Treffene under nevner likevel &laquo;
                        {query.getAll("q").join(", ")}&raquo; i annonseteksten
                    </BodyShort>
                </Box>
            )}
        </>
    );
}
