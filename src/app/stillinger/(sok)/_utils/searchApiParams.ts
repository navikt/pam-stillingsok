import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import type { Locations } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";

export type SearchApiParams = {
    q?: string[] | undefined;
    from?: number | undefined;
    size?: number | undefined;
    counties?: string[] | undefined;
    countries?: string[] | undefined;
    municipals?: string[] | undefined;
    international?: boolean | undefined;
    remote?: string[] | undefined;
    occupationFirstLevels?: string[] | undefined;
    occupationSecondLevels?: string[] | undefined;
    published?: string | undefined;
    needDriversLicense?: string[] | undefined;
    under18?: string[] | undefined;
    education?: string[] | undefined;
    engagementType?: string[] | undefined;
    experience?: string[] | undefined;
    extent?: string[] | undefined;
    sector?: string[] | undefined;
    sort?: string | undefined;
    workLanguage?: string[] | undefined;
    explain?: boolean | undefined;
    isSummerJob?: boolean | undefined;
    isXmasJob?: boolean | undefined;
    hasSuperraskSoknad?: boolean | undefined;
    postcode?: string | undefined;
    distance?: string | undefined;
    withinDrivingDistance?: Locations | undefined;
};

export function toSearchApiParams(query: ExtendedQuery): SearchApiParams {
    return {
        q: query.q,
        from: query.from,
        size: query.size,
        counties: query.counties,
        countries: query.countries,
        municipals: query.municipals,
        international: query.international,
        remote: query.remote,
        occupationFirstLevels: query.occupationFirstLevels,
        occupationSecondLevels: query.occupationSecondLevels,
        published: query.published,
        needDriversLicense: query.needDriversLicense,
        under18: query.under18,
        education: query.education,
        engagementType: query.engagementType,
        experience: query.experience,
        extent: query.extent,
        sector: query.sector,
        sort: query.sort,
        workLanguage: query.workLanguage,
        explain: query.explain,
        isSummerJob: query.isSummerJob,
        isXmasJob: query.isXmasJob,
        hasSuperraskSoknad: query.hasSuperraskSoknad,
        postcode: query.postcode,
        distance: query.distance,
        withinDrivingDistance: query.withinDrivingDistance,
    };
}
