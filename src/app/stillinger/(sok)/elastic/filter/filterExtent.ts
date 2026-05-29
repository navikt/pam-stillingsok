import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export const ExtentEnum = {
    HELTID: "Heltid",
    DELTID: "Deltid",
    HELTID_OG_DELTID: "Heltid_og_Deltid",
    UKJENT: "Ukjent",
};

export function filterExtent(extent: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (extent && extent.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        extent.forEach((item) => {
            if (item === ExtentEnum.HELTID) {
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.HELTID,
                    },
                });
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.HELTID_OG_DELTID,
                    },
                });
            } else if (item === ExtentEnum.DELTID) {
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.DELTID,
                    },
                });
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.HELTID_OG_DELTID,
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.UKJENT,
                    },
                });
            }
        });
        filters.push(filter);
    }
    return filters;
}
