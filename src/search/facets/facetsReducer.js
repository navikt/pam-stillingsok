import {FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS} from '../searchReducer';

export const OCCUPATION_LEVEL_OTHER = 'Uoppgitt/ ikke identifiserbare';

const initialState = {
    locations: [],
    locationFacets: [],
    engagementTypeFacets: [],
    extentFacets: [],
    occupationFirstLevelFacets: [],
    occupationSecondLevelFacets: [],
    sectorFacets: [],
    publishedFacets: []
};

/**
 * Holder oversikt over alle kjente fasetter (søkekriterier) som bruker kan velge blant.
 * Oppdaterer også antall treff per fasett etter hvert søk, f.eks "Oslo (25)"
 */
export default function facetsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                locations: action.response.locations,
                extentFacets: action.response.extent,
                sectorFacets: moveFacetToBottom(action.response.sector, 'Ikke oppgitt'),
                engagementTypeFacets: action.response.engagementTypes,
                publishedFacets: action.response.published,
                occupationFirstLevelFacets: moveFacetToBottom(action.response.occupationFirstLevels, OCCUPATION_LEVEL_OTHER),
                locationFacets: buildLocationFacets(action.response.nationalCountMap, action.response.internationalCountMap, action.response.locations),
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                sectorFacets: updateCount(state.sectorFacets, action.response.sector),
                extentFacets: updateCount(state.extentFacets, action.response.extent),
                engagementTypeFacets: updateCount(state.engagementTypeFacets, action.response.engagementTypes),
                publishedFacets: updateCount(state.publishedFacets, action.response.published),
                occupationFirstLevelFacets: updateCount(state.occupationFirstLevelFacets, action.response.occupationFirstLevels, 'occupationSecondLevels'),
                locationFacets: buildLocationFacets(action.response.nationalCountMap, action.response.internationalCountMap, state.locations),
            };
        default:
            return state;
    }
}

/**
 * Listen over fasetter man får fra backend kan inneholde
 * verdier man ønsker skal komme på bunn av listen, f.eks "Annet"
 *
 * @returns Returnerer en ny liste, hvor et gitt fasettverdi er flyttet til bunn av listen
 */
function moveFacetToBottom(facets, facetKey) {
    const clone = facets.concat();

    clone.forEach((item, i) => {
        if (item.key === facetKey) {
            clone.push(clone.splice(i, 1)[0]);
        }
    });

    return clone;
}

/**
 * Bygg array som inneholder alle fylker og kommuner i norge, samt andre land (utland),
 * sortert alfabetisk, med antall søketreff
 *
 * @param nationalCountMap: map med antall treff for nasjonale lokasjoner
 * @param internationalCountMap: map med antall treff for internasjonale lokasjoner
 * @param locations: liste med lokasjoner hentet fra backend (fylker, kommuner, utland)
 * @returns array med lokasjon facets
 */
function buildLocationFacets(nationalCountMap, internationalCountMap, locations) {
    const facets = [];

    locations.forEach(l => {
        const facet = {
            type: 'county',
            key: l.key,
            count: 0,
            subLocations: []
        };

        if (l.key === 'UTLAND') {
            facet.type = 'international';

            for (let key in internationalCountMap) {
                if (internationalCountMap.hasOwnProperty(key)) {
                    facet.subLocations.push({
                        type: 'country',
                        key: key.toUpperCase(),
                        count: internationalCountMap[key],
                    });

                    facet.count += internationalCountMap[key];
                }
            }
        } else {
            facet.count = nationalCountMap[l.key] === undefined ? 0 : nationalCountMap[l.key];

            l.municipals.forEach(m => {
                facet.subLocations.push({
                    type: 'municipal',
                    key: m.key,
                    count: nationalCountMap[m.key] === undefined ? 0 : nationalCountMap[m.key]
                });
            });
        }

        if ((facet.key === 'JAN MAYEN' || facet.key === 'KONTINENTALSOKKELEN') && facet.count === 0) {
            // Ikke vis disse to fylkene om de ikke har noen annonser
        } else {
            facet.subLocations.sort((a, b) => {
                return a.key > b.key ? 1 : -1;
            });

            facets.push(facet);
        }
    });

    return facets.sort((a, b) => {
        if (a.key === 'UTLAND') return 1;
        if (b.key === 'UTLAND') return -1;
        return a.key > b.key ? 1 : -1;
    });
}

/**
 * Når det er utført et søk, oppdateres antall treff per fasett, f.eks "Oslo (25)"
 *
 * @param initialValues: Alle opprinnelige fasetter
 * @param newValues: Oppdaterte fasetter fra backend
 * @param nestedKey (Optional): Navn på evt. underkategori som også skal oppdateres, f. eks municipals
 * @returns Returnerer en ny liste, hvor antall treff per fasett er oppdatert
 */
function updateCount(initialValues, newValues, nestedKey) {
    if (nestedKey === undefined) {
        return initialValues.map((item) => {
            const found = newValues.find((e) => (
                e.key === item.key
            ));
            return {
                ...item,
                count: found ? found.count : 0
            };
        })
    }
    return initialValues.map((firstLevel) => {
        const foundFirstLevel = newValues.find((c) => (
            c.key === firstLevel.key
        ));
        return {
            ...firstLevel,
            count: foundFirstLevel ? foundFirstLevel.count : 0,
            [nestedKey]: firstLevel[nestedKey].map((secondLevel) => {
                let newSecondLevelCount = 0;
                if (foundFirstLevel) {
                    const foundSecondLevel = foundFirstLevel[nestedKey].find((m) => (
                        m.key === secondLevel.key
                    ));
                    newSecondLevelCount = foundSecondLevel ? foundSecondLevel.count : 0;
                }
                return {
                    ...secondLevel,
                    count: newSecondLevelCount
                };
            })
        };
    })
}
