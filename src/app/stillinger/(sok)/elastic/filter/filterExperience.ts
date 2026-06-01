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
            filter.bool?.should?.push({
                term: {
                    experience_facet: item,
                },
            });
        });

        if (experience.includes(IKKE_OPPGITT)) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "experience_facet",
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
