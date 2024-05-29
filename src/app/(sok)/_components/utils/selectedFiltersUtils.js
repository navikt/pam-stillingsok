import {
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    SET_INTERNATIONAL,
} from "@/app/(sok)/_utils/queryReducer";

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

export function removeCountry(queryDispatch, query, value) {
    // Fjern land fra filter
    queryDispatch({ type: REMOVE_COUNTRY, value });

    // Hvis dette var den siste landet, så skal "Utland" også fjernes
    if (query.countries.length === 1) {
        queryDispatch({ type: SET_INTERNATIONAL, value: false });
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
