import React from "react";
import { deriveSearchBoxState } from "@/app/stillinger/(sok)/_components/searchBox/searchBoxState";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { BodyShort, HStack } from "@navikt/ds-react";
import { CarIcon } from "@navikt/aksel-icons";
import DrivingDistanceResetButton from "@/app/stillinger/(sok)/_components/searchBox/DrivingDistanceResetButton";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";

type SearchBoxDrivingDistanceProps = {
    searchParams: URLSearchParams;
    /*readonly postcodesPromise: Promise<FetchResult<Postcode[]>>;*/
    readonly postcodesPromise: FetchResult<Postcode[]>;
};
async function SearchBoxDrivingDistance({ searchParams, postcodesPromise }: SearchBoxDrivingDistanceProps) {
    //const postcodesResult = await postcodesPromise;

    //const postcodes = postcodesResult.data ?? [];
    const postcodes = postcodesPromise.data ?? [];
    const searchBoxState = deriveSearchBoxState(searchParams, postcodes);

    if (!searchBoxState.drivingDistanceSummary) {
        return null;
    }
    return (
        <HStack align="center" wrap={false} gap="space-4">
            <HStack wrap={false} align="center" gap="space-8">
                <CarIcon aria-hidden="true" fontSize="1.5rem" />
                <BodyShort>
                    Innen {searchBoxState.drivingDistanceSummary.distanceKm} km fra{" "}
                    {searchBoxState.drivingDistanceSummary.postcode}
                    {searchBoxState.drivingDistanceSummary.locationSuffix}
                </BodyShort>
            </HStack>

            <DrivingDistanceResetButton />
        </HStack>
    );
}

export default SearchBoxDrivingDistance;
