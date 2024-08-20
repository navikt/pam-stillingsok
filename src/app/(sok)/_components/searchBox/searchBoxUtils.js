import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_EDUCATION,
    ADD_ENGAGEMENT_TYPE,
    ADD_EXPERIENCE,
    ADD_EXTENT,
    ADD_MUNICIPAL,
    ADD_NEEDDRIVERSLICENSE,
    ADD_OCCUPATION,
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    ADD_REMOTE,
    ADD_SECTOR,
    ADD_WORKLANGUAGE,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_EDUCATION,
    REMOVE_ENGAGEMENT_TYPE,
    REMOVE_EXPERIENCE,
    REMOVE_EXTENT,
    REMOVE_MUNICIPAL,
    REMOVE_NEEDDRIVERSLICENSE,
    REMOVE_OCCUPATION,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    REMOVE_REMOTE,
    REMOVE_SECTOR,
    REMOVE_WORKLANGUAGE,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
} from "@/app/(sok)/_utils/queryReducer";
import { labelForNeedDriversLicense } from "@/app/(sok)/_components/filters/DriversLicense";

const MUNICIPAL = "municipal";
const COUNTY = "county";
const COUNTRY = "country";
const INTERNATIONAL = "international";
const OCCUPATION_SECOND_LEVEL = "occupationSecondLevel";
const OCCUPATION_FIRST_LEVEL = "occupationFirstLevel";
const OCCUPATION = "occupation";
const PUBLISHED = "published";
const SECTOR = "sector";
const ENGAGEMENT_TYPE = "engagementType";
const EXTENT = "extent";
const EDUCATION = "education";
const WORK_LANGUAGE = "workLanguage";
const REMOTE = "remote";
const NEED_DRIVERS_LICENSE = "needDriversLicense";
const EXPERIENCE = "experience";

export const findLabelForFilter = (value) => {
    switch (value) {
        case MUNICIPAL:
            return "(Kommune)";
        case COUNTY:
            return "(Fylke)";
        case COUNTRY:
            return "(Land)";
        case OCCUPATION_FIRST_LEVEL:
            return "(Yrkesgruppe)";
        case OCCUPATION:
            return "(Yrke)";
        case SECTOR:
            return "(Sektor)";
        case ENGAGEMENT_TYPE:
            return "(Ansettelsesform)";
        case EXTENT:
            return "(Omfang)";
        case EDUCATION:
            return "(Utdanning)";
        case WORK_LANGUAGE:
            return "(Arbeidsspråk)";
        case NEED_DRIVERS_LICENSE:
            return "(Førerkort)";
        default:
            return "";
    }
};

export function getSearchBoxOptions(aggregations, locations, allSuggestions) {
    const locationList = buildLocations(aggregations, locations);

    const municipalList = locationList
        .map((location) => location.subLocations)
        .flat()
        .filter((subLocation) => subLocation.type === MUNICIPAL)
        .map((municipal) => ({
            label: fixLocationName(municipal.key.split(".")[1]),
            value: `${MUNICIPAL}-${municipal.key}`,
        }));

    const countyList = locationList
        .filter((location) => location.type === COUNTY)
        .map((county) => ({
            label: fixLocationName(county.key),
            value: `${COUNTY}-${county.key}`,
        }));

    const countryList = locationList
        .filter((location) => location.type === INTERNATIONAL)
        .map((location) => location.subLocations)
        .flat()
        .map((country) => ({
            label: fixLocationName(country.key),
            value: `${COUNTRY}-${country.key}`,
        }));

    const withSortedSecondLevelOccupations = aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
    const sortedByLetterFirstLevelOccupationsList = sortValuesByFirstLetter(withSortedSecondLevelOccupations).map(
        (occupation) => ({
            label: occupation.key,
            value: `${OCCUPATION_FIRST_LEVEL}-${occupation.key}`,
        }),
    );

    const secondLevelOccupationsList = withSortedSecondLevelOccupations
        .map((item) => item.secondLevel)
        .flat()
        .map((secondLevel) => ({
            label: secondLevel.key.split(".")[1],
            value: `${OCCUPATION_SECOND_LEVEL}-${secondLevel.key}`,
        }));

    const publishedList = aggregations.published.map((item) => ({
        label: PublishedLabelsEnum[item.key],
        value: `${PUBLISHED}-${item.key}`,
    }));

    const sectorList = aggregations.sector.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item.key}` }
            : { label: item.key, value: `${SECTOR}-${item.key}` },
    );

    const engagementTypeList = aggregations.engagementTypes.map((item) =>
        editedItemKey(item.key) === "Ikke oppgitt"
            ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item.key}` }
            : { label: item.key, value: `${ENGAGEMENT_TYPE}-${item.key}` },
    );
    const extentList = aggregations.extent.map((item) => ({
        label: item.key,
        value: `${EXTENT}-${item.key}`,
    }));

    const educationList = aggregations.education.map((item) =>
        item.key === "Ikke oppgitt"
            ? {
                  label: "Utdanning ikke oppgitt",
                  value: `${EDUCATION}-${item.key}`,
              }
            : {
                  label: item.key,
                  value: `${EDUCATION}-${item.key}`,
              },
    );

    const workLanguageList = aggregations.workLanguage.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item.key}` }
            : { label: item.key, value: `${WORK_LANGUAGE}-${item.key}` },
    );

    const remoteList = aggregations.remote.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item.key}` }
            : { label: item.key, value: `${REMOTE}-${item.key}` },
    );

    const occupationSuggestionList = allSuggestions.map((suggestion) => ({
        label: suggestion,
        value: `${OCCUPATION}-${suggestion}`,
    }));

    const needDriversLicenseList = aggregations.needDriversLicense.map((licence) =>
        licence.key === "Ikke oppgitt"
            ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${licence.key}` }
            : {
                  label: labelForNeedDriversLicense(licence.key),
                  value: `${NEED_DRIVERS_LICENSE}-${licence.key}`,
              },
    );

    const experienceList = aggregations.experience.map((experience) =>
        experience.key === "Ikke oppgitt"
            ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience.key}` }
            : {
                  label: experience.key,
                  value: `${EXPERIENCE}-${experience.key}`,
              },
    );

    return [
        ...municipalList,
        ...countyList,
        ...countryList,
        ...sortedByLetterFirstLevelOccupationsList,
        ...secondLevelOccupationsList,
        ...publishedList,
        ...sectorList,
        ...engagementTypeList,
        ...extentList,
        ...educationList,
        ...workLanguageList,
        ...remoteList,
        ...occupationSuggestionList,
        ...needDriversLicenseList,
        ...experienceList,
    ];
}

export const getFilter = {
    [MUNICIPAL]: { add: ADD_MUNICIPAL, remove: REMOVE_MUNICIPAL },
    [COUNTY]: { add: ADD_COUNTY, remove: REMOVE_COUNTY },
    [INTERNATIONAL]: { add: SET_INTERNATIONAL, remove: SET_INTERNATIONAL },
    [COUNTRY]: { add: ADD_COUNTRY, remove: REMOVE_COUNTRY },
    [OCCUPATION_FIRST_LEVEL]: {
        add: ADD_OCCUPATION_FIRST_LEVEL,
        remove: REMOVE_OCCUPATION_FIRST_LEVEL,
    },
    [OCCUPATION_SECOND_LEVEL]: {
        add: ADD_OCCUPATION_SECOND_LEVEL,
        remove: REMOVE_OCCUPATION_SECOND_LEVEL,
    },
    [PUBLISHED]: { add: SET_PUBLISHED, remove: SET_PUBLISHED },
    [ENGAGEMENT_TYPE]: { add: ADD_ENGAGEMENT_TYPE, remove: REMOVE_ENGAGEMENT_TYPE },
    [EXTENT]: { add: ADD_EXTENT, remove: REMOVE_EXTENT },
    [WORK_LANGUAGE]: { add: ADD_WORKLANGUAGE, remove: REMOVE_WORKLANGUAGE },
    [EDUCATION]: { add: ADD_EDUCATION, remove: REMOVE_EDUCATION },
    [NEED_DRIVERS_LICENSE]: { add: ADD_NEEDDRIVERSLICENSE, remove: REMOVE_NEEDDRIVERSLICENSE },
    [REMOTE]: { add: ADD_REMOTE, remove: REMOVE_REMOTE },
    [SECTOR]: { add: ADD_SECTOR, remove: REMOVE_SECTOR },
    [OCCUPATION]: { add: ADD_OCCUPATION, remove: REMOVE_OCCUPATION },
    [EXPERIENCE]: { add: ADD_EXPERIENCE, remove: REMOVE_EXPERIENCE },
};

export function addMunicipal(queryDispatch, query, value) {
    // Legg til kommunen i filter
    queryDispatch({ type: ADD_MUNICIPAL, value });

    // Hvis fylket ikke allerede er valgt, så legg til dette også
    const county = value.split(".")[0];
    if (!query.counties.includes(county)) {
        queryDispatch({ type: ADD_COUNTY, value: county });
    }
}

export function removeMunicipal(queryDispatch, query, value) {
    // Fjern kommunen fra filter
    queryDispatch({ type: REMOVE_MUNICIPAL, value });

    // Hvis dette var den siste valgte kommune i samme fylke, så skal fylket også fjernes
    const county = value.split(".")[0];
    const remainingMunicipalsInCounty = query.municipals.filter((municipal) => municipal.startsWith(`${county}.`));
    if (remainingMunicipalsInCounty.length === 1) {
        queryDispatch({ type: REMOVE_COUNTY, value: county });
    }
}

// Ikke vis fylke hvis bruker har valgt en eller flere kommuner i dette fylket
export function filterCounties(query) {
    return query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });
}

export function addCountry(queryDispatch, query, value) {
    // Legg til land i filter
    queryDispatch({ type: ADD_COUNTRY, value });

    // Hvis "Utland" ikke allerede er valgt, så legg til denne også
    queryDispatch({ type: SET_INTERNATIONAL, value: true });
}

export function removeCountry(queryDispatch, query, value) {
    // Fjern land fra filter
    queryDispatch({ type: REMOVE_COUNTRY, value });

    // Hvis dette var den siste landet, så skal "Utland" også fjernes
    if (query.countries.length === 1) {
        queryDispatch({ type: SET_INTERNATIONAL, value: false });
    }
}

// Ikke vis yrkeskategori hvis bruker har valgt et eller flere yrker i denne kategorien
export function filterOccupationFirstLevels(query) {
    return query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });
}

export function addOccupationSecondLevel(queryDispatch, query, value) {
    // Legg til yrket i filter
    queryDispatch({ type: ADD_OCCUPATION_SECOND_LEVEL, value });

    // Hvis yrkeskategorien ikke allerede er valgt, så legg til denne også
    const firstLevel = value.split(".")[0];
    if (!query.occupationFirstLevels.includes(firstLevel)) {
        queryDispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, value: firstLevel });
    }
}

export function removeOccupationSecondLevel(queryDispatch, query, value) {
    // Fjern yrket fra filter
    queryDispatch({ type: REMOVE_OCCUPATION_SECOND_LEVEL, value });

    // Hvis dette var det siste yrket i samme yrkeskategori, så skal yrkeskategorien også fjernes
    const firstLevel = value.split(".")[0];
    const remainingOccupationsInCategory = query.occupationSecondLevels.filter((secondLevel) =>
        secondLevel.startsWith(`${firstLevel}.`),
    );
    if (remainingOccupationsInCategory.length === 1) {
        queryDispatch({ type: REMOVE_OCCUPATION_FIRST_LEVEL, value: firstLevel });
    }
}

export function getQueryOptions(queryObject) {
    const searchTerm = queryObject.q && queryObject.q.trim();
    const searchTerms = searchTerm ? searchTerm.split(" ") : [];
    return [
        ...searchTerms,
        ...queryObject.municipals.map((municipals) => ({
            label: fixLocationName(municipals.split(".")[1]),
            value: `${MUNICIPAL}-${municipals}`,
        })),
        ...filterCounties(queryObject).map((c) => ({
            label: fixLocationName(c),
            value: `${COUNTY}-${c}`,
        })),
        ...queryObject.countries.map((countries) => ({
            label: fixLocationName(countries),
            value: `${COUNTRY}-${countries}`,
        })),
        ...(queryObject.international && queryObject.countries.length === 0
            ? [{ label: "Utland", value: `${INTERNATIONAL}-utland` }]
            : []),
        ...queryObject.occupationSecondLevels.map((occupation) => ({
            label: occupation.split(".")[1],
            value: `${OCCUPATION_SECOND_LEVEL}-${occupation}`,
        })),
        ...filterOccupationFirstLevels(queryObject).map((occupation) => ({
            label: occupation,
            value: `${OCCUPATION_FIRST_LEVEL}-${occupation}`,
        })),
        ...(queryObject.published
            ? [
                  {
                      label: PublishedLabelsEnum[queryObject.published],
                      value: `${PUBLISHED}-${queryObject.published}`,
                  },
              ]
            : []),
        ...queryObject.sector.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Sektor ikke oppgitt", value: `${SECTOR}-${item}` }
                : { label: item, value: `${SECTOR}-${item}` },
        ),
        ...queryObject.engagementType.map((item) =>
            editedItemKey(item) === "Ikke oppgitt"
                ? { label: "Ansettelsesform ikke oppgitt", value: `${ENGAGEMENT_TYPE}-${item}` }
                : { label: item, value: `${ENGAGEMENT_TYPE}-${item}` },
        ),
        ...queryObject.extent.map((item) => ({ label: item, value: `${EXTENT}-${item}` })),
        ...queryObject.education.map((item) =>
            item === "Ikke oppgitt"
                ? {
                      label: "Utdanning ikke oppgitt",
                      value: `${EDUCATION}-${item}`,
                  }
                : {
                      label: item,
                      value: `${EDUCATION}-${item}`,
                  },
        ),
        ...queryObject.workLanguage.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Arbeidsspråk ikke oppgitt", value: `${WORK_LANGUAGE}-${item}` }
                : { label: item, value: `${WORK_LANGUAGE}-${item}` },
        ),
        ...queryObject.remote.map((item) =>
            item === "Ikke oppgitt"
                ? { label: "Hjemmekontor ikke oppgitt", value: `${REMOTE}-${item}` }
                : { label: item, value: `${REMOTE}-${item}` },
        ),
        ...queryObject.occupations.map((occupation) => ({
            label: occupation,
            value: `${OCCUPATION}-${occupation}`,
        })),
        ...queryObject.needDriversLicense.map((licence) =>
            licence === "Ikke oppgitt"
                ? { label: "Førerkort ikke oppgitt", value: `${NEED_DRIVERS_LICENSE}-${licence}` }
                : {
                      label: labelForNeedDriversLicense(licence),
                      value: `${NEED_DRIVERS_LICENSE}-${licence}`,
                  },
        ),
        ...queryObject.experience.map((experience) =>
            experience === "Ikke oppgitt"
                ? { label: "Erfaring ikke oppgitt", value: `${EXPERIENCE}-${experience}` }
                : {
                      label: experience,
                      value: `${EXPERIENCE}-${experience}`,
                  },
        ),
    ];
}
