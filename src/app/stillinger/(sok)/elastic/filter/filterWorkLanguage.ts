import { IKKE_OPPGITT } from "@/app/stillinger/(sok)/elastic/filter/constants";
import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterWorkLanguage(workLanguage: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (workLanguage && workLanguage.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        workLanguage.forEach((item) => {
            if (item === IKKE_OPPGITT) {
                filter.bool?.should?.push({
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "worklanguage_facet",
                                },
                            },
                        ],
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        worklanguage_facet: item,
                    },
                });
            }
        });
        filters.push(filter);
    }
    return filters;
}
