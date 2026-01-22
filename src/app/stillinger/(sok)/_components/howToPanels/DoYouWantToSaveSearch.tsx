import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type DoYouWantToSaveSearchProps = {
    resultsPerPage: number;
    totalAds: number;
};
function DoYouWantToSaveSearch({ resultsPerPage, totalAds }: DoYouWantToSaveSearchProps) {
    const searchParams = useSearchParams();
    const fromParam = searchParams.get(QueryNames.FROM);
    const from = fromParam ? parseInt(fromParam, 10) : 0;

    if (from + resultsPerPage >= totalAds) {
        return (
            <Box padding={{ xs: "space-16", md: "space-24" }} borderRadius="2" background="meta-lime-soft">
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
