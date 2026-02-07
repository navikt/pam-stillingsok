export const COUNTY_PARAM = "county";
export const MUNICIPAL_PARAM = "municipal";

export type LocationQueryState = {
    readonly county: string | null;
    readonly municipal: string | null;
};

export const deriveCountyKeyFromMunicipalKey = (municipalKey: string): string => {
    return municipalKey.split(".", 1)[0] ?? "";
};

export const readLocationQueryState = (searchParams: URLSearchParams): LocationQueryState => {
    const municipal = searchParams.get(MUNICIPAL_PARAM);
    const county = searchParams.get(COUNTY_PARAM);

    return {
        county: county && county.trim().length > 0 ? county : null,
        municipal: municipal && municipal.trim().length > 0 ? municipal : null,
    };
};

export const normalizeLocationQueryState = (input: LocationQueryState): LocationQueryState => {
    if (input.municipal) {
        const derived = deriveCountyKeyFromMunicipalKey(input.municipal);
        const county = input.county ?? derived;
        return { county, municipal: input.municipal };
    }
    return input;
};
