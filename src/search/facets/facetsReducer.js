import {FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS} from '../searchReducer';
import allCounties from '../data/allCounties';

export const OCCUPATION_LEVEL_OTHER = 'Uoppgitt/ ikke identifiserbare';

const initialState = {
    countyFacets: [],
    municipalFacets: [],
    countryFacets: [],
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
                extentFacets: action.response.extent,
                sectorFacets: moveFacetToBottom(action.response.sector, 'Ikke oppgitt'),
                engagementTypeFacets: moveFacetToBottom(action.response.engagementTypes, 'Annet'),
                publishedFacets: action.response.published,
                occupationFirstLevelFacets: moveFacetToBottom(action.response.occupationFirstLevels, OCCUPATION_LEVEL_OTHER),
                countyFacets: createFullCountiesArray(action.response.counties),
                countryFacets: action.response.countries
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                sectorFacets: updateCount(state.sectorFacets, action.response.sector),
                extentFacets: updateCount(state.extentFacets, action.response.extent),
                engagementTypeFacets: updateCount(state.engagementTypeFacets, action.response.engagementTypes),
                publishedFacets: updateCount(state.publishedFacets, action.response.published),
                occupationFirstLevelFacets: updateCount(state.occupationFirstLevelFacets, action.response.occupationFirstLevels, 'occupationSecondLevels'),
                countyFacets: createFullCountiesArray(updateCount(state.countyFacets, action.response.counties, 'municipals')),
                countryFacets: updateCount(state.countryFacets, action.response.countries),
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
 * Bygg array som inneholder alle fylker og kommuner i norge, sortert alfabetisk
 *
 * @param counties: forrige versjon av counties array
 * @returns array med counties
 */
function createFullCountiesArray(counties) {
    const countMap = {};

    counties.forEach(c => {
        countMap[c.key] = c.count;

        c.municipals.forEach(m => {
            countMap[m.key] = m.count;
        })
    });

    allCounties.forEach(c => {
        c.count = countMap[c.key] === undefined ? 0 : countMap[c.key];

        c.municipals.forEach(m => {
            m.count = countMap[m.key] === undefined ? 0 : countMap[m.key];
        });

        c.municipals = c.municipals.sort((a, b) => {
            return a.key > b.key ? 1 : -1;
        });
    });

    return allCounties.sort((a, b) => {
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
