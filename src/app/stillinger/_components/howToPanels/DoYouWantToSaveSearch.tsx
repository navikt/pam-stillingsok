import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";
import { SEARCH_CHUNK_SIZE } from "@/app/stillinger/_utils/query";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/_utils/QueryNames";

type DoYouWantToSaveSearchProps = {
    totalAds: number;
};
function DoYouWantToSaveSearch({ totalAds }: DoYouWantToSaveSearchProps) {
    const searchParams = useSearchParams();
    const fromParam = searchParams.get(QueryNames.FROM);
    const from = fromParam ? parseInt(fromParam, 10) : 0;

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
