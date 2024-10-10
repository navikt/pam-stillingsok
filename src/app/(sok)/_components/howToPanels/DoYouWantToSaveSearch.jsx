import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/lagrede-sok/_components/SaveSearchButton";
import { SEARCH_CHUNK_SIZE } from "@/app/(sok)/_utils/query";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

function DoYouWantToSaveSearch({ totalAds }) {
    const searchParams = useSearchParams();
    const from = searchParams.has(QueryNames.FROM) ? parseInt(searchParams.get(QueryNames.FROM), 10) : 0;

    if (from + SEARCH_CHUNK_SIZE >= totalAds) {
        return (
            <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-2-subtle">
                <VStack align="center">
                    <Heading level="3" size="small" className="text-center" spacing>
                        Varsel ved nye treff?
                    </Heading>
                    <BodyShort className="text-center" spacing>
                        Lagre søket og motta e-post ved nye treff.
                    </BodyShort>
                    <SaveSearchButton />
                </VStack>
            </Box>
        );
    }
    return null;
}

export default DoYouWantToSaveSearch;
