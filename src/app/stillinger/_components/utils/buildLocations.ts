import FilterAggregations from "@/app/stillinger/_types/FilterAggregations";
import { SearchLocation } from "@/app/stillinger/page";
import { LocationList } from "@/app/stillinger/_components/searchBox/buildSearchBoxOptions";

/**
 * Bygg array som inneholder alle fylker og kommuner i norge, samt andre land (utland),
 * sortert alfabetisk, med antall søketreff
 *
 * @returns array med lokasjon facets
 */
export default function buildLocations(aggregations: FilterAggregations, locations: SearchLocation[]) {
    const facets: LocationList[] = [];
    const { nationalCountMap, internationalCountMap } = aggregations;

    locations.forEach((l) => {
        const facet: LocationList = {
            type: "county",
            key: l.key,
            count: 0,
            subLocations: [],
        };

        if (l.key === "UTLAND") {
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
            facet.count = nationalCountMap[l.key] === undefined ? 0 : nationalCountMap[l.key];

            l.municipals.forEach((m) => {
                facet.subLocations?.push({
                    type: "municipal",
                    key: m.key,
                    count: nationalCountMap[m.key] === undefined ? 0 : nationalCountMap[m.key],
                });
            });
        }

        if ((facet.key === "JAN MAYEN" || facet.key === "KONTINENTALSOKKELEN") && facet.count === 0) {
            // Ikke vis disse to fylkene om de ikke har noen annonser
        } else {
            facet.subLocations?.sort((a, b) => (a.key > b.key ? 1 : -1));

            facets.push(facet);
        }
    });

    return facets.sort((a, b) => {
        if (a.key === "UTLAND") return 1;
        if (b.key === "UTLAND") return -1;
        return a.key > b.key ? 1 : -1;
    });
}
