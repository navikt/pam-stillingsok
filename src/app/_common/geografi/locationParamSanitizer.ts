import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { normalizeLocationQueryState, type LocationQueryState } from "@/app/_common/geografi/locationQueryParams";

export type LocationWhitelist = {
    readonly countyKeys: ReadonlySet<string>;
    readonly municipalKeys: ReadonlySet<string>;
};

const trimOrNull = (value: string | null | undefined): string | null => {
    const trimmed = (value ?? "").trim();
    if (trimmed.length === 0) {
        return null;
    }
    return trimmed;
};

const toKeyCanonical = (value: string): string => {
    return value.trim().toLocaleUpperCase("nb-NO");
};

const sanitizeCountyKey = (raw: string | null | undefined): string | null => {
    const value = trimOrNull(raw);
    if (!value) {
        return null;
    }

    const canonical = toKeyCanonical(value);
    if (canonical.includes(".")) {
        return null;
    }

    return canonical;
};

export const buildLocationWhitelist = (locations: readonly SearchLocation[]): LocationWhitelist => {
    const countyKeys = new Set<string>();
    const municipalKeys = new Set<string>();

    for (const county of locations) {
        countyKeys.add(toKeyCanonical(county.key));
        for (const municipal of county.municipals) {
            municipalKeys.add(toKeyCanonical(municipal.key));
        }
    }

    return { countyKeys, municipalKeys };
};

export const sanitizeAndNormalizeLocationParams = (
    input: { readonly county?: string | null; readonly municipal?: string | null },
    whitelist?: LocationWhitelist,
): LocationQueryState => {
    const countyCandidate = sanitizeCountyKey(input.county);
    const municipalRaw = trimOrNull(input.municipal);
    const municipalCandidate = municipalRaw ? toKeyCanonical(municipalRaw) : null;

    // Normaliser: municipal gyldig => county avledes fra municipal, municipal ugyldig => municipal=null
    const normalizedFromMunicipal = normalizeLocationQueryState({
        county: null,
        municipal: municipalCandidate,
    });

    if (normalizedFromMunicipal.municipal) {
        const municipalOk = !whitelist || whitelist.municipalKeys.has(normalizedFromMunicipal.municipal);
        const countyOk =
            !whitelist ||
            (normalizedFromMunicipal.county ? whitelist.countyKeys.has(normalizedFromMunicipal.county) : false);

        if (municipalOk && countyOk) {
            return {
                county: normalizedFromMunicipal.county,
                municipal: normalizedFromMunicipal.municipal,
            };
        }
    }

    if (countyCandidate) {
        if (whitelist && !whitelist.countyKeys.has(countyCandidate)) {
            return { county: null, municipal: null };
        }

        return { county: countyCandidate, municipal: null };
    }

    return { county: null, municipal: null };
};
