import type { ReadonlyURLSearchParams } from "next/navigation";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import type { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type DrivingDistanceSummary = Readonly<{
    distanceKm: string;
    postcode: string;
    locationSuffix: string;
}>;

export type DrivingDistanceState = Readonly<{
    drivingDistanceFilterActive: boolean;
    drivingDistanceSummary: DrivingDistanceSummary | null;
}>;

export function deriveDrivingDistanceState(
    searchParams: URLSearchParams | ReadonlyURLSearchParams,
    postcodes: readonly Postcode[],
): DrivingDistanceState {
    const postcode = searchParams.get(QueryNames.POSTCODE);
    const distance = searchParams.get(QueryNames.DISTANCE);

    const hasValidPostcode = postcode !== null && postcode.length === 4;

    const parsedDistance = distance !== null ? Number.parseInt(distance, 10) : Number.NaN;

    const hasValidDistance = Number.isInteger(parsedDistance) && parsedDistance > 0;

    const drivingDistanceFilterActive = hasValidPostcode && hasValidDistance;

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
        drivingDistanceSummary,
    };
}
