import type { BoolFilter, TermFilter } from "@/app/stillinger/(sok)/elastic/types/types";

/**
 * Lager filter for fasetter med flere nivå, feks fylke og kommune. Kombinerer AND og OR.
 * Feks (Akershus) OR (Buskerud) hvis man bare har valgt disse to fylkene.
 * Feks (Akershus AND (Asker OR Bærum)) OR (Buskerud AND Drammen) om man ser etter jobb i Asker, Bærum eller Drammen
 * Feks (Akershus) OR (Buskerud AND Drammen) om man ser etter jobb i hele Akershus fylke, men også i Drammen kommune.
 */
export function filterNestedFacets(
    parents: string[] | undefined,
    children: string[],
    parentKey: string,
    childKey: string,
    nestedField?: string,
) {
    let allMusts: Array<Array<TermFilter | BoolFilter>> = [];
    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            let must: (TermFilter | BoolFilter)[] = [
                {
                    term: {
                        [parentKey]: parent,
                    },
                },
            ];

            const childrenOfCurrentParent = children.filter((m) => m.split(".")[0] === parent);
            if (childrenOfCurrentParent.length > 0) {
                must = [
                    ...must,
                    {
                        bool: {
                            should: childrenOfCurrentParent.map((child) => ({
                                term: {
                                    [childKey]: child.split(".")[1], // child kan feks være AKERSHUS.ASKER
                                },
                            })),
                        },
                    },
                ];
            }

            allMusts = [...allMusts, must];
        });
    }

    const queryObject: BoolFilter = {
        bool: {
            should: allMusts.map((must) => ({
                bool: {
                    must: must,
                },
            })),
        },
    };

    return nestedField
        ? {
              nested: {
                  path: nestedField,
                  query: queryObject,
              },
          }
        : queryObject;
}
