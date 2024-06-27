export function migrateToV2(searchParams) {
    const result = {
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
    delete result["occupationFirstLevels[]"];
    delete result["occupationSecondLevels[]"];
    delete result["municipals[]"];
    delete result["counties[]"];
    delete result["countries[]"];
    delete result["extent[]"];
    delete result["engagementType[]"];
    delete result["sector[]"];
    delete result["education[]"];
    delete result["workLanguage[]"];
    delete result["remote[]"];

    return result;
}
