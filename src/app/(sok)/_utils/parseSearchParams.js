export function parseSearchParams(urlSearchParams) {
    const searchParamsObject = {};

    urlSearchParams.forEach((value, key) => {
        if (searchParamsObject[key]) {
            if (Array.isArray(searchParamsObject[key])) {
                searchParamsObject[key] = [...searchParamsObject[key], value];
            } else {
                searchParamsObject[key] = [searchParamsObject[key], value];
            }
        } else {
            searchParamsObject[key] = value;
        }
    });
    return searchParamsObject;
}
