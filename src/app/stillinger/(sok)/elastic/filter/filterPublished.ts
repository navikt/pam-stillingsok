import type { RangeFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterPublished(published: string | undefined): RangeFilter[] {
    const filters = [];
    if (published) {
        filters.push({
            range: {
                published: {
                    gte: published,
                    time_zone: "CET",
                },
            },
        });
    }
    return filters;
}
