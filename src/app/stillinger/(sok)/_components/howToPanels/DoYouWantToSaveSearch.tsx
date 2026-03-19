import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { createSavedSearchParamsWithoutVersion } from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";

type DoYouWantToSaveSearchProps = {
    resultsPerPage: number;
    totalAds: number;
};
function DoYouWantToSaveSearch({ resultsPerPage, totalAds }: DoYouWantToSaveSearchProps) {
    const searchParams = useSearchParams();
    const savedSearchParamsWithoutVersion = createSavedSearchParamsWithoutVersion(searchParams);
    const fromParam = savedSearchParamsWithoutVersion.get(QueryNames.FROM);
    const from = fromParam ? parseInt(fromParam, 10) : 0;

    if (from + resultsPerPage >= totalAds) {
        return (
            <Box padding={{ xs: "space-16", md: "space-24" }} borderRadius="2" className="bg-brand-blue-soft">
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
