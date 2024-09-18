import React from "react";
import { useSearchParams } from "next/navigation";
import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import DetectiveIcon from "../icons/DetectiveIcon";

const ELASTIC_SEARCH_PAGINATION_LIMIT = 10000;

function MaxResultsBox({ resultsPerPage }) {
    const searchParams = useSearchParams();
    const from = searchParams.has(FROM) ? parseInt(searchParams.get(FROM), 10) : 0;

    if (from + resultsPerPage === ELASTIC_SEARCH_PAGINATION_LIMIT) {
        return (
            <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-1-subtle">
                <HStack wrap={false} justify="center" align="center" gap="2">
                    <Box>
                        <Heading level="3" size="small" spacing>
                            Du har nådd maks antall annonser for ditt søk
                        </Heading>
                        <BodyShort spacing>
                            Utvid søket ditt ved å prøve andre filtre eller søkeord for å oppdage flere annonser.
                        </BodyShort>
                    </Box>

                    <Box paddingInline="4">
                        <DetectiveIcon />
                    </Box>
                </HStack>
            </Box>
        );
    }

    return null;
}

export default MaxResultsBox;
