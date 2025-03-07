export function parseSearchParams(urlSearchParams: URLSearchParams) {
    const searchParamsObject: Record<string, string | string[]> = {};

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
