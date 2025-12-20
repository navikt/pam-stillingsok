import React from "react";
import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import SaveSearchButton from "@/app/(nonce)/stillinger/lagrede-sok/_components/SaveSearchButton";
import { useSearchParams } from "next/navigation";
import { QueryNames } from "@/app/(nonce)/stillinger/(sok)/_utils/QueryNames";

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
