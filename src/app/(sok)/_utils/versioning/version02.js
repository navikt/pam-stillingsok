export function migrateToV2(searchParams) {
    let newSearchParams = {
        ...searchParams,
    };

    if (newSearchParams["occupationFirstLevels[]"]) {
        newSearchParams = {
            ...newSearchParams,
            occupationLevel1: newSearchParams["occupationFirstLevels[]"],
        };
        delete newSearchParams["occupationFirstLevels[]"];
    }

    if (newSearchParams["occupationSecondLevels[]"]) {
        newSearchParams = {
            ...newSearchParams,
            occupationLevel2: newSearchParams["occupationSecondLevels[]"],
        };
        delete newSearchParams["occupationSecondLevels[]"];
    }

    if (newSearchParams["municipals[]"]) {
        newSearchParams = {
            ...newSearchParams,
            municipal: newSearchParams["municipals[]"],
        };
        delete newSearchParams["municipals[]"];
    }

    if (newSearchParams["counties[]"]) {
        newSearchParams = {
            ...newSearchParams,
            county: newSearchParams["counties[]"],
        };
        delete newSearchParams["counties[]"];
    }

    if (newSearchParams["countries[]"]) {
        newSearchParams = {
            ...newSearchParams,
            country: newSearchParams["countries[]"],
        };
        delete newSearchParams["countries[]"];
    }

    if (newSearchParams["extent[]"]) {
        newSearchParams = {
            ...newSearchParams,
            extent: newSearchParams["extent[]"],
        };
        delete newSearchParams["extent[]"];
    }

    if (newSearchParams["engagementType[]"]) {
        newSearchParams = {
            ...newSearchParams,
            engagementType: newSearchParams["engagementType[]"],
        };
        delete newSearchParams["engagementType[]"];
    }

    if (newSearchParams["sector[]"]) {
        newSearchParams = {
            ...newSearchParams,
            sector: newSearchParams["sector[]"],
        };
        delete newSearchParams["sector[]"];
    }

    if (newSearchParams["education[]"]) {
        newSearchParams = {
            ...newSearchParams,
            education: newSearchParams["education[]"],
        };
        delete newSearchParams["education[]"];
    }

    if (newSearchParams["workLanguage[]"]) {
        newSearchParams = {
            ...newSearchParams,
            workLanguage: newSearchParams["workLanguage[]"],
        };
        delete newSearchParams["workLanguage[]"];
    }

    if (newSearchParams["remote[]"]) {
        newSearchParams = {
            ...newSearchParams,
            remote: newSearchParams["remote[]"],
        };
        delete newSearchParams["remote[]"];
    }

    return newSearchParams;
}
