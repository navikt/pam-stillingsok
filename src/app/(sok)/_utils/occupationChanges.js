/* eslint-disable no-restricted-syntax */

// Format: Key : [Values]
// Key = Old occupation
// Values = New occupation/s
const changedSearchParams = {
    "Utdanning.Forskningsarbeid": ["Utdanning.Forskningsarbeid", "Bygg og anlegg;Andre ingeniører"],
    "Utdanning.SFO, barne- og fritidsleder": [
        "Helse og sosial.Miljøarbeidere",
        "Helse og sosial.Ledere av omsorgstjenetser for barn",
    ],
    "Helse og sosial.Helse": [
        "Helse og sosial.Vernepleier",
        "Helse og sosial.Helse- og miljørådgivere",
        "Helse og sosial.Helsesekretær",
        "Helse og sosial.Andre helseyrker",
        "Helse og sosial.Helsefagarbeider",
        "Helse og sosial.Andre helseyrker",
    ],
    "Helse og sosial.Psykologer og terapeuter": [
        "Helse og sosial.Fysioterapeut",
        "Helse og sosial.Ernæringsfysiolog",
        "Helse og sosial.Audiografer og logopeder",
        "Helse og sosial.Ergoterapeut",
        "Helse og sosial.Kiropraktor og osteopat",
        "Helse og sosial.Psykolog",
        "Helse og sosial.Radiograf og audiograf",
        "Helse og sosial.Alternativ medisin",
    ],
    "Helse og sosial.Sosial": [
        "Helse og sosial.Rådgivere innen sosiale fagfelt",
        "Helse og sosial.Hjemmehjelper og personlig assistent",
    ],
    "Natur og miljø.Matproduksjon og næringsmiddelarbeid": ["Kontor og økonomi.Personal, arbeidsmiljø og rekruttering"],
    "Kultur og kreative yrker.Journalistikk og litteratur": [
        "Kultur og kreative yrker.Journalistikk, kommunikasjon og litteratur",
    ],
    "Kultur og kreative yrker;Museum, bibliotek": ["Kultur og kreative yrker.Museum, bibliotek, arkiv"],
    "Utdanning.Barnehage": ["Utdanning.Førskolelærer", "Utdanning.Barnehage- og skolefritidsassistenter"],
};

export function containsOldOccupations(searchParams, changedOccupations = changedSearchParams) {
    const firstLevels = getOccupationFirstLevels(searchParams);
    const secondLevels = getOccupationSecondLevels(searchParams);

    if (firstLevels.length === 0 || secondLevels.length === 0) {
        return false;
    }

    for (const secondLevel of secondLevels) {
        if (getChangedSecondLevelOccupations(changedOccupations).includes(secondLevel)) {
            return true;
        }
    }

    return false;
}

export function rewriteOccupationSearchParams(searchParams, changedOccupations = changedSearchParams) {
    const initialSecondLevels = getOccupationSecondLevels(searchParams);
    const onlyInFirstLevel = getOccupationsOnlyInFirstLevel(searchParams);

    const newSecondLevels = initialSecondLevels
        .map((secondLevel) => {
            if (getChangedSecondLevelOccupations(changedOccupations).includes(secondLevel)) {
                return changedOccupations[secondLevel];
            }
            return secondLevel;
        })
        .flat();

    const firstLevelsFromNewSecondLevels = newSecondLevels.map((secondLevel) => secondLevel.split(".")[0]);

    const newFirstLevels = [...new Set([...onlyInFirstLevel, ...firstLevelsFromNewSecondLevels])];

    return {
        ...searchParams,
        "occupationFirstLevels[]": newFirstLevels,
        "occupationSecondLevels[]": newSecondLevels,
    };
}

export function getOccupationsOnlyInFirstLevel(searchParams) {
    const firstLevels = getOccupationFirstLevels(searchParams);
    const secondLevels = getOccupationSecondLevels(searchParams);

    return firstLevels.filter((firstLevel) => {
        for (const secondLevel of secondLevels) {
            if (secondLevel.indexOf(firstLevel) !== -1) {
                return false;
            }
        }

        return true;
    });
}

function getOccupationFirstLevels(searchParams) {
    return toArray(searchParams["occupationFirstLevels[]"]);
}

function getOccupationSecondLevels(searchParams) {
    return toArray(searchParams["occupationSecondLevels[]"]);
}

function toArray(value) {
    if (value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function getChangedSecondLevelOccupations(searchParams) {
    return Object.keys(searchParams);
}
