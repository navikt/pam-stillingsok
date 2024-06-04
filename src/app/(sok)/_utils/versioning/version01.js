import { containsOldOccupations, rewriteOccupationSearchParams } from "@/app/(sok)/_utils/occupationChanges";

const changedOccupations = {
    "Utdanning.Forskningsarbeid": ["Utdanning.Forskningsarbeid", "Bygg og anlegg.Andre ingeniører"],
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
    "Kultur og kreative yrker.Museum, bibliotek": ["Kultur og kreative yrker.Museum, bibliotek, arkiv"],
    "Utdanning.Barnehage": ["Utdanning.Førskolelærer", "Utdanning.Barnehage- og skolefritidsassistenter"],
};

export function migrateToV1(searchParams) {
    let newSearchParams = searchParams;

    // V1 changes some occupations to new ones.
    // After changing, users might still access a search with their old occupations due to saved searches and bookmarks.
    if (containsOldOccupations(searchParams, changedOccupations)) {
        newSearchParams = rewriteOccupationSearchParams(newSearchParams, changedOccupations);
    }

    return newSearchParams;
}
