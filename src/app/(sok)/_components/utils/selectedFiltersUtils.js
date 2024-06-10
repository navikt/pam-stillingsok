import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_MUNICIPAL,
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    SET_INTERNATIONAL,
} from "@/app/(sok)/_utils/queryReducer";

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
