import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import { type Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";

import { ReadonlyURLSearchParams } from "next/navigation";
import {
    createSavedSearchParamsWithoutVersion,
    searchParamsSize,
} from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";

type DrivingDistanceSummary = Readonly<{
    distanceKm: string;
    postcode: string;
    locationSuffix: string;
}>;

export type SearchBoxState = Readonly<{
    drivingDistanceFilterActive: boolean;
    showSaveAndResetButton: boolean;
    drivingDistanceSummary: DrivingDistanceSummary | null;
}>;

export function deriveSearchBoxState(
    searchParams: URLSearchParams | ReadonlyURLSearchParams,
    postcodes: readonly Postcode[],
): SearchBoxState {
    const postcode = searchParams.get(QueryNames.POSTCODE);
    const distance = searchParams.get(QueryNames.DISTANCE);

    const hasValidPostcode = postcode !== null && postcode.length === 4;

    const parsedDistance = distance !== null ? Number.parseInt(distance, 10) : Number.NaN;

    const hasValidDistance = Number.isInteger(parsedDistance) && parsedDistance > 0;

    const drivingDistanceFilterActive = hasValidPostcode && hasValidDistance;

    const savedSearchParamsWithoutVersion = createSavedSearchParamsWithoutVersion(searchParams);

    const onlyDrivingDistanceFiltersActive =
        searchParamsSize(savedSearchParamsWithoutVersion) === 2 &&
        savedSearchParamsWithoutVersion.has(QueryNames.POSTCODE) &&
        savedSearchParamsWithoutVersion.has(QueryNames.DISTANCE);

    const showSaveAndResetButton =
        searchParamsSize(savedSearchParamsWithoutVersion) > 0 && !onlyDrivingDistanceFiltersActive;

    let drivingDistanceSummary: DrivingDistanceSummary | null = null;

    if (drivingDistanceFilterActive && postcode !== null && distance !== null) {
        const matchedPostcode = postcodes.find((entry) => {
            return entry.postcode === postcode;
        });

        const locationSuffix = matchedPostcode?.city !== undefined ? ` ${fixLocationName(matchedPostcode.city)}` : "";

        drivingDistanceSummary = {
            distanceKm: distance,
            postcode,
            locationSuffix,
        };
    }

    return {
        drivingDistanceFilterActive,
        showSaveAndResetButton,
        drivingDistanceSummary,
    };
}
