export function migrateToV2(searchParams) {
    return {
        ...searchParams,
        occupationLevel1: searchParams["occupationFirstLevels[]"],
        occupationLevel2: searchParams["occupationSecondLevels[]"],
        municipal: searchParams["municipals[]"],
        county: searchParams["counties[]"],
        country: searchParams["countries[]"],
        extent: searchParams["extent[]"],
        engagementType: searchParams["engagementType[]"],
        sector: searchParams["sector[]"],
        education: searchParams["education[]"],
        workLanguage: searchParams["workLanguage[]"],
        remote: searchParams["remote[]"],
    };
}
