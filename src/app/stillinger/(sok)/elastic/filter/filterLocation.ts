import type { BoolFilter, NestedFilter, TermFilter } from "@/app/stillinger/(sok)/elastic/types/types";

const specialMunicipals = {
    OS: ["OS (INNLANDET)"],
    SANDE: ["SANDE (MØRE OG ROMSDAL)"],
    BØ: ["BØ (NORDLAND)"],
    NES: ["NES (VIKEN)", "NES (AKERSHUS)"],
} as const;

// Filtrer på alle type locations (land, kommune, fylke, internasjonalt)
export function filterLocation(
    counties: string[] | undefined,
    municipals: string[] | undefined,
    countries: string[] | undefined,
    international: boolean = false,
) {
    const filter: NestedFilter = {
        nested: {
            path: "locationList",
            query: {
                bool: {
                    should: [],
                },
            },
        },
    };

    if (Array.isArray(counties)) {
        const countiesComputed: { key: string; municipals: string[] }[] = [];

        counties.forEach((c) => {
            countiesComputed.push({
                key: c,
                municipals: Array.isArray(municipals) ? municipals.filter((m) => m.split(".")[0] === c) : [],
            });
        });

        countiesComputed.forEach((c) => {
            const must: (TermFilter | BoolFilter)[] = [
                {
                    term: {
                        "locationList.county.keyword": c.key,
                    },
                },
            ];

            if (c.municipals.length > 0) {
                let mustObject: BoolFilter = {
                    bool: {
                        should: [],
                    },
                };

                if (countries?.includes("Hack")) {
                    mustObject = {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        must_not: {
                                            exists: {
                                                field: "locationList.municipal.keyword",
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    };
                }

                c.municipals.forEach((m) => {
                    const municipal = m.split(".")[1] as keyof typeof specialMunicipals;
                    if (municipal in specialMunicipals) {
                        mustObject.bool?.should?.push({
                            terms: {
                                "locationList.municipal.keyword": [municipal, ...specialMunicipals[municipal]],
                            },
                        });
                    } else {
                        mustObject.bool?.should?.push({
                            term: {
                                "locationList.municipal.keyword": municipal,
                            },
                        });
                    }
                });

                must.push(mustObject);
            }

            filter.nested.query.bool?.should?.push({
                bool: {
                    must,
                },
            });
        });
    }

    const internationalObject: BoolFilter = {
        bool: {},
    };

    if (international) {
        internationalObject.bool.must_not = {
            term: {
                "locationList.country.keyword": "NORGE",
            },
        };
    }

    if (Array.isArray(countries) && countries.length > 0) {
        internationalObject.bool.should = [
            ...countries.map((c) => ({
                term: {
                    "locationList.country.keyword": c,
                },
            })),
        ];
    }

    if (
        Object.keys(internationalObject.bool).includes("must_not") ||
        Object.keys(internationalObject.bool).includes("should")
    ) {
        filter.nested.query.bool?.should?.push(internationalObject);
    }

    return filter;
}
