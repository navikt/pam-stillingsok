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
import {
    COUNTRY,
    COUNTY,
    EDUCATION,
    ENGAGEMENT_TYPE,
    EXPERIENCE,
    EXTENT,
    INTERNATIONAL,
    MUNICIPAL,
    NEED_DRIVERS_LICENSE,
    OCCUPATION,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    PUBLISHED,
    Query,
    REMOTE,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchBox/searchBoxOption";
import { Dispatch } from "react";

export const findLabelForFilter = (value: string) => {
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

export function addMunicipalFilter(queryDispatch: Dispatch<QueryDispatch>, query: Query, value: string) {
    // Legg til kommunen i filter
    queryDispatch({ type: "ADD_MUNICIPAL", value });

    // Hvis fylket ikke allerede er valgt, så legg til dette også
    const county = value.split(".")[0];
    if (!query.counties.includes(county)) {
        queryDispatch({ type: "ADD_COUNTY", value: county });
    }
}

export function removeMunicipalFilter(queryDispatch: Dispatch<QueryDispatch>, query: Query, value: string) {
    // Fjern kommunen fra filter
    queryDispatch({ type: REMOVE_MUNICIPAL, value });

    // Hvis dette var den siste valgte kommune i samme fylke, så skal fylket også fjernes
    const county = value.split(".")[0];
    const remainingMunicipalsInCounty = query.municipals.filter((municipal) => municipal.startsWith(`${county}.`));
    if (remainingMunicipalsInCounty.length === 1) {
        queryDispatch({ type: REMOVE_COUNTY, value: county });
    }
}

export function addCountryFilter(queryDispatch: Dispatch<QueryDispatch>, value: string) {
    // Legg til land i filter
    queryDispatch({ type: ADD_COUNTRY, value });

    // Hvis "Utland" ikke allerede er valgt, så legg til denne også
    queryDispatch({ type: SET_INTERNATIONAL, value: true });
}

export function removeCountryFilter(queryDispatch: Dispatch<QueryDispatch>, query: Query, value: string) {
    // Fjern land fra filter
    queryDispatch({ type: REMOVE_COUNTRY, value });

    // Hvis dette var den siste landet, så skal "Utland" også fjernes
    if (query.countries.length === 1) {
        queryDispatch({ type: SET_INTERNATIONAL, value: false });
    }
}

export function addOccupationSecondLevelFilter(queryDispatch: Dispatch<QueryDispatch>, query: Query, value: string) {
    // Legg til yrket i filter
    queryDispatch({ type: ADD_OCCUPATION_SECOND_LEVEL, value });

    // Hvis yrkeskategorien ikke allerede er valgt, så legg til denne også
    const firstLevel = value.split(".")[0];
    if (!query.occupationFirstLevels.includes(firstLevel)) {
        queryDispatch({ type: ADD_OCCUPATION_FIRST_LEVEL, value: firstLevel });
    }
}

export function removeOccupationSecondLevelFilter(queryDispatch: Dispatch<QueryDispatch>, query: Query, value: string) {
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

// TODO: ikke sikker denne er helt riktig, men funker?
interface QueryDispatch {
    type: string;
    value: string | boolean;
}
