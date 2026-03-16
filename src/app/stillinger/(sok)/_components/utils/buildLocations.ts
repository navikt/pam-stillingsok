import type FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { type SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { type LocationList, type MutableLocationList } from "@/app/stillinger/types/LocationList";

/**
 * Bygg array som inneholder alle fylker og kommuner i Norge, samt andre land (utland),
 * sortert alfabetisk, med antall søketreff.
 *
 * @returns array med lokasjons-fasetter
 */
function compareLocationKeys(firstLocation: { key: string }, secondLocation: { key: string }): number {
    return firstLocation.key.localeCompare(secondLocation.key, "nb-NO");
}

function compareTopLevelLocations(firstLocation: { key: string }, secondLocation: { key: string }): number {
    if (firstLocation.key === "UTLAND") {
        return 1;
    }

    if (secondLocation.key === "UTLAND") {
        return -1;
    }

    return compareLocationKeys(firstLocation, secondLocation);
}

function toReadonlyLocationList(location: MutableLocationList): LocationList {
    return {
        type: location.type,
        key: location.key,
        count: location.count,
        subLocations: location.subLocations?.map((subLocation) => {
            return toReadonlyLocationList(subLocation);
        }),
    };
}

export default function buildLocations(
    aggregations: FilterAggregations,
    locations: readonly SearchLocation[],
): LocationList[] {
    const facets: MutableLocationList[] = [];
    const { nationalCountMap, internationalCountMap } = aggregations;

    locations.forEach((location) => {
        const facet: MutableLocationList = {
            type: "county",
            key: location.key,
            count: 0,
            subLocations: [],
        };

        if (location.key === "UTLAND") {
            facet.type = "international";
            facet.count = aggregations.totalInternational || 0;

            Object.entries(internationalCountMap).forEach(([key, value]) => {
                facet.subLocations?.push({
                    type: "country",
                    key: key.toUpperCase(),
                    count: value,
                });
            });
        } else {
            facet.count = nationalCountMap[location.key] === undefined ? 0 : nationalCountMap[location.key];

            location.municipals.forEach((municipal) => {
                facet.subLocations?.push({
                    type: "municipal",
                    key: municipal.key,
                    count: nationalCountMap[municipal.key] === undefined ? 0 : nationalCountMap[municipal.key],
                });
            });
        }

        if ((facet.key === "JAN MAYEN" || facet.key === "KONTINENTALSOKKELEN") && facet.count === 0) {
            return;
        }

        facet.subLocations?.sort(compareLocationKeys);
        facets.push(facet);
    });

    facets.sort(compareTopLevelLocations);

    return facets.map((facet) => {
        return toReadonlyLocationList(facet);
    });
}
