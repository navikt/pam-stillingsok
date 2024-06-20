import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";

/**
 * Takes an urlSearchParams object
 * and returns new url with parameters that is related to search only
 */
export default function toSavedSearch(urlSearchParams) {
    const result = [];

    const paramsRelatedToSearch = Object.values(SearchQueryParams);
    const ignoreParams = [SearchQueryParams.FROM, SearchQueryParams.SIZE, SearchQueryParams.SORT];

    result.push(["v", CURRENT_VERSION]);

    urlSearchParams.forEach((value, name) => {
        if (paramsRelatedToSearch.includes(name) && !ignoreParams.includes(name)) {
            result.push([name, value]);
        }
    });

    return new URLSearchParams(result);
}
