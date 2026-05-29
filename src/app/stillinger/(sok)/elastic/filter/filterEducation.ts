import { NOT_DEFINED } from "@/app/stillinger/(sok)/elastic/filter/constants";
import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterEducation(education: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (education && education.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        education.forEach((item) => {
            if (item === NOT_DEFINED) {
                filter.bool?.should?.push({
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "education_facet",
                                },
                            },
                        ],
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        education_facet: item,
                    },
                });
            }
        });
        filters.push(filter);
    }
    return filters;
}
