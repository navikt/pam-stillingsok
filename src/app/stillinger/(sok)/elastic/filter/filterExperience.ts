import { IKKE_OPPGITT } from "@/app/stillinger/(sok)/elastic/filter/constants";
import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterExperience(experience: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (experience && experience.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        experience.forEach((item) => {
            if (item === IKKE_OPPGITT) {
                filter.bool?.should?.push({
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "workExperience_facet",
                                },
                            },
                        ],
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        workExperience_facet: item,
                    },
                });
            }
        });

        filters.push(filter);
    }
    return filters;
}
