import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterNeedDriversLicense(needDriversLicense: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (needDriversLicense && needDriversLicense.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        needDriversLicense.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    needDriversLicense_facet: item,
                },
            });
        });

        if (needDriversLicense.includes("Ikke oppgitt")) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "needDriversLicense_facet",
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
