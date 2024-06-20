import { useRouter } from "next/navigation";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";

export const URL_PARAMS_VERSION_NAME = "v";

function setUrlParamsVersion(urlSearchParams) {
    if (urlSearchParams.size > 0 && !urlSearchParams.has(URL_PARAMS_VERSION_NAME)) {
        // Set query version if missing
        return new URLSearchParams(`${URL_PARAMS_VERSION_NAME}=${CURRENT_VERSION}&${urlSearchParams.toString()}`);
    }
    if (urlSearchParams.size === 1 && urlSearchParams.has(URL_PARAMS_VERSION_NAME)) {
        // Skip query version if it is only remaining parameter
        return new URLSearchParams();
    }
    return urlSearchParams;
}

function resetFrom(urlSearchParams, options) {
    if (options?.resetFrom !== false) {
        urlSearchParams.delete(SearchQueryParams.FROM);
    }
    return urlSearchParams;
}

export function setDefaultParameters(urlSearchParams, options) {
    let newUrlSearchParams = setUrlParamsVersion(urlSearchParams);
    newUrlSearchParams = resetFrom(newUrlSearchParams, options);
    return newUrlSearchParams;
}

function useSearchRouter() {
    const router = useRouter();

    function replace(urlSearchParams, options) {
        const newUrlSearchParams = setDefaultParameters(urlSearchParams, options);
        router.replace(`/?${newUrlSearchParams.toString()}`, options);
    }

    function push(urlSearchParams, options) {
        const newUrlSearchParams = setDefaultParameters(urlSearchParams, options);
        router.push(`/?${newUrlSearchParams.toString()}`, options);
    }

    return {
        replace,
        push,
    };
}

export default useSearchRouter;
