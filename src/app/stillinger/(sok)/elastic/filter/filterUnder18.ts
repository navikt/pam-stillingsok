import { IKKE_OPPGITT } from "@/app/stillinger/(sok)/elastic/filter/constants";
import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterUnder18(under18: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (under18 && under18.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        under18.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    under18_facet: item,
                },
            });
        });

        if (under18.includes(IKKE_OPPGITT)) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "under18_facet",
                            },
                        },
                    ],
                },
            });
        }

        filters.push(filter);
    }
    return filters;
}
