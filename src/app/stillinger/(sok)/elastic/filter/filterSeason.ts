import { filterIsSummerJob } from "@/app/stillinger/(sok)/elastic/filter/filterIsSummerJob";
import { filterIsXmasJob } from "@/app/stillinger/(sok)/elastic/filter/filterIsXmasJob";
import type { BoolFilter, TermFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterSeason(isSummerJob?: boolean, isXmasJob?: boolean): (BoolFilter | TermFilter)[] {
    const seasonFilters = [...filterIsSummerJob(isSummerJob ?? false), ...filterIsXmasJob(isXmasJob ?? false)];

    if (seasonFilters.length < 2) {
        return seasonFilters;
    }

    return [
        {
            bool: {
                should: seasonFilters,
                minimum_should_match: 1,
            },
        },
    ];
}
