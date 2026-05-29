import { IKKE_OPPGITT } from "@/app/stillinger/(sok)/elastic/filter/constants";
import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function filterRemote(remote: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (remote && remote.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        remote.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    remote_facet: item,
                },
            });
        });

        if (remote.includes(IKKE_OPPGITT)) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "remote_facet",
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
