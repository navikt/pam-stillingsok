export const changedOccupations = {
    "Utdanning.Forskningsarbeid": ["Utdanning.Forskningsarbeid", "Bygg og anlegg.Andre ingeniører"],
    "Utdanning.SFO, barne- og fritidsleder": [
        "Helse og sosial.Miljøarbeidere",
        "Helse og sosial.Ledere av omsorgstjenetser for barn",
    ],
    "Helse og sosial.Helse": [
        "Helse og sosial.Vernepleier",
        "Helse og sosial.Helse- og miljørådgivere",
        "Helse og sosial.Helsesekretær",
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
    "Kultur og kreative yrker.Museum, bibliotek": ["Kultur og kreative yrker.Museum, bibliotek, arkiv"],
    "Utdanning.Barnehage": ["Utdanning.Førskolelærer", "Utdanning.Barnehage- og skolefritidsassistenter"],
};

const OCCUPATION_SECOND_LEVEL = "occupationSecondLevels[]";
const OCCUPATION_FIRST_LEVEL = "occupationFirstLevels[]";

export function migrateOccupationParam(oldValue, newValues, searchParams) {
    const result = new URLSearchParams(searchParams.toString());

    result.delete(OCCUPATION_SECOND_LEVEL, oldValue);

    const oldFirstLevel = oldValue.split(".")[0];
    const shouldDeleteFirstLevel =
        result.getAll(OCCUPATION_SECOND_LEVEL).filter((it) => it.split(".")[0] === oldFirstLevel).length === 0;

    if (shouldDeleteFirstLevel) {
        result.delete(OCCUPATION_FIRST_LEVEL, oldFirstLevel);
    }

    newValues.forEach((newValue) => {
        const firstLevel = newValue.split(".")[0];
        const shouldAppendFirstLevel = !result.has(OCCUPATION_FIRST_LEVEL, firstLevel);

        if (shouldAppendFirstLevel) {
            result.append(OCCUPATION_FIRST_LEVEL, firstLevel);
        }

        result.append(OCCUPATION_SECOND_LEVEL, newValue);
    });
    return result;
}

export function migrateToV1(searchParams) {
    let migratedSearchParams = new URLSearchParams(searchParams.toString());

    migratedSearchParams.forEach((value, key) => {
        if (key === OCCUPATION_SECOND_LEVEL) {
            const newValues = changedOccupations[value];
            if (newValues) {
                migratedSearchParams = migrateOccupationParam(value, newValues, migratedSearchParams);
            }
        }
    });

    return migratedSearchParams;
}
