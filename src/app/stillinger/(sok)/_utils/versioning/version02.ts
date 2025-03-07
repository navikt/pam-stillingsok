function renameParam(paramKey: string) {
    switch (paramKey) {
        case "occupationFirstLevels[]":
            return "occupationLevel1";
        case "occupationSecondLevels[]":
            return "occupationLevel2";
        case "municipals[]":
            return "municipal";
        case "counties[]":
            return "county";
        case "countries[]":
            return "country";
        case "extent[]":
            return "extent";
        case "engagementType[]":
            return "engagementType";
        case "sector[]":
            return "sector";
        case "education[]":
            return "education";
        case "workLanguage[]":
            return "workLanguage";
        case "remote[]":
            return "remote";
        default:
            return paramKey;
    }
}

export function migrateToV2(searchParams: URLSearchParams) {
    const migratedSearchParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
        migratedSearchParams.append(renameParam(key), value);
    });
    return migratedSearchParams;
}
