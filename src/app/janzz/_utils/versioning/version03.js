export function migrateToV3(searchParams) {
    if (searchParams.fields === "occupation") {
        const result = {
            ...searchParams,
        };
        result.occupation = searchParams.q;
        delete result.q;
        delete result.fields;

        return result;
    }

    return searchParams;
}
