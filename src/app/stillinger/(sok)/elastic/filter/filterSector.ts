import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterSector(sector: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (sector && sector.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        sector.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    sector_facet: item,
                },
            });
        });
        filters.push(filter);
    }
    return filters;
}
