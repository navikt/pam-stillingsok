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
    result.delete("occupationFirstLevels[]");
    result.delete("occupationSecondLevels[]");
    result.delete("municipals[]");
    result.delete("counties[]");
    result.delete("countries[]");
    result.delete("extent[]");
    result.delete("engagementType[]");
    result.delete("sector[]");
    result.delete("education[]");
    result.delete("workLanguage[]");
    result.delete("remote[]");

    return result;
}
