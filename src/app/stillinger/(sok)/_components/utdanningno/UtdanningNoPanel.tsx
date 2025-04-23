import React from "react";
import { BodyShort, Box, Heading, HGrid, Link as AkselLink } from "@navikt/ds-react";
import { SEARCH_CHUNK_SIZE } from "@/app/stillinger/(sok)/_utils/query";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import FigureConfused from "@/app/_common/components/FigureConfused";

type UtdanningNoPanelProps = {
    totalAds: number;
};
function UtdanningNoPanel({ totalAds }: UtdanningNoPanelProps) {
    const searchParams = useSearchParams();
    const fromParam = searchParams.get(QueryNames.FROM);
    const from = fromParam ? parseInt(fromParam, 10) : 0;

    if (from + SEARCH_CHUNK_SIZE >= totalAds) {
        return (
            <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-3-subtle">
                <HGrid gap="4" columns="repeat(2, minmax(0, auto))" align="center">
                    <div>
                        <Heading level="3" size="small" spacing>
                            Fant du ikke noe som fristet?
                        </Heading>

                        <BodyShort spacing>
                            Utforsk hvilke{" "}
                            <AkselLink
                                className="default-text-color-link"
                                data-umami-event="Søkeresultat klikk utdanning.no"
                                href="https://utdanning.no/interessesiden/yrker/"
                            >
                                jobber som passer dine interesser på utdanning.no
                            </AkselLink>
                        </BodyShort>
                    </div>

                    <div>
                        <FigureConfused />
                    </div>
                </HGrid>
            </Box>
        );
    }
    return null;
}

export default UtdanningNoPanel;
