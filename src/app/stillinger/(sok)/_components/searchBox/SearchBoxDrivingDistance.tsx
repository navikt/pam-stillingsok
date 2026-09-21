import { CarIcon } from "@navikt/aksel-icons";
import { BodyShort, HStack } from "@navikt/ds-react";
import DrivingDistanceResetButton from "@/app/stillinger/(sok)/_components/searchBox/DrivingDistanceResetButton";
import { deriveDrivingDistanceState } from "@/app/stillinger/(sok)/_components/searchBox/drivingDistanceState";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import type { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";

type SearchBoxDrivingDistanceProps = {
    searchParams: URLSearchParams;
    readonly postcodesResult: FetchResult<Postcode[]>;
};
async function SearchBoxDrivingDistance({ searchParams, postcodesResult }: SearchBoxDrivingDistanceProps) {
    const postcodes = postcodesResult.data ?? [];
    const drivingDistanceState = deriveDrivingDistanceState(searchParams, postcodes);

    if (!drivingDistanceState.drivingDistanceSummary) {
        return null;
    }
    return (
        <HStack align="center" wrap={false} gap="space-4">
            <HStack wrap={false} align="center" gap="space-8">
                <CarIcon aria-hidden="true" fontSize="1.5rem" />
                <BodyShort>
                    Innen {drivingDistanceState.drivingDistanceSummary.distanceKm} km fra{" "}
                    {drivingDistanceState.drivingDistanceSummary.postcode}
                    {drivingDistanceState.drivingDistanceSummary.locationSuffix}
                </BodyShort>
            </HStack>

            <DrivingDistanceResetButton />
        </HStack>
    );
}

export default SearchBoxDrivingDistance;
