import React, { ReactElement } from "react";

import { BodyShort, Box, Heading, HStack } from "@navikt/ds-react";

import DetectiveIcon from "../icons/DetectiveIcon";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import { useSearchParams } from "next/navigation";

const ELASTIC_SEARCH_PAGINATION_LIMIT = 10000;

interface MaxResultsBoxProps {
    resultsPerPage: number;
}

export default function MaxResultsBox({ resultsPerPage }: MaxResultsBoxProps): ReactElement | null {
    const searchParams = useSearchParams();
    const from = searchParams.has(QueryNames.FROM) ? parseInt(searchParams.get(QueryNames.FROM)!, 10) : 0;

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
