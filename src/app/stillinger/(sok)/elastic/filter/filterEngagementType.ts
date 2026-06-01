import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterEngagementType(engagementTypes: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (engagementTypes && engagementTypes.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        engagementTypes.forEach((engagementType) => {
            filter.bool?.should?.push({
                term: {
                    engagementtype_facet: engagementType,
                },
            });
        });
        filters.push(filter);
    }
    return filters;
}
