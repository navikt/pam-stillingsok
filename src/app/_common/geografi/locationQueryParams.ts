import { parseMunicipalKey } from "@/app/_common/geografi/locationKeyParsing";

export const COUNTY_PARAM = "county";
export const MUNICIPAL_PARAM = "municipal";

export type LocationQueryState = {
    readonly county: string | null;
    readonly municipal: string | null;
};

const trimOrNull = (value: string | null | undefined): string | null => {
    const trimmed = (value ?? "").trim();
    if (trimmed.length === 0) {
        return null;
    }
    return trimmed;
};

export const readLocationQueryStateFromSearchParams = (searchParams: URLSearchParams): LocationQueryState => {
    const county = trimOrNull(searchParams.get(COUNTY_PARAM));
    const municipal = trimOrNull(searchParams.get(MUNICIPAL_PARAM));

    return { county, municipal };
};
/**
 * Normaliserer slik at:
 * - Når municipal er gyldig: county avledes fra municipal (og overskriver evt feil county)
 * - Når municipal er ugyldig: municipal blir null, county beholdes om den finnes
 */
export const normalizeLocationQueryState = (input: LocationQueryState): LocationQueryState => {
    const county = trimOrNull(input.county);
    const municipalRaw = trimOrNull(input.municipal);

    if (!municipalRaw) {
        return { county, municipal: null };
    }

    const parsed = parseMunicipalKey(municipalRaw);
    if (!parsed) {
        return { county, municipal: null };
    }

    return { county: parsed.countyKey, municipal: municipalRaw };
};

/**
 * Praktisk helper for request-body: tar county/municipal fra hvilken som helst query-shape.
 * Passer fint å kalle med ExtendedQuery.
 */
export const getNormalizedLocationFromQuery = (query: {
    readonly county?: string | null;
    readonly municipal?: string | null;
}): LocationQueryState => {
    return normalizeLocationQueryState({
        county: trimOrNull(query.county),
        municipal: trimOrNull(query.municipal),
    });
};

/**
 * For UI: sjekk om URL egentlig er “skitten” og bør normaliseres i browser.
 */
export const isLocationQueryStateDifferent = (a: LocationQueryState, b: LocationQueryState): boolean => {
    return a.county !== b.county || a.municipal !== b.municipal;
};

export const deriveCountyFromMunicipalKey = (municipalKey: string): string | null => {
    const normalized = normalizeLocationQueryState({ county: null, municipal: municipalKey });
    return normalized.municipal ? normalized.county : null;
};
