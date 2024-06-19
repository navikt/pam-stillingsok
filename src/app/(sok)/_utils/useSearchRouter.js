import { useRouter } from "next/navigation";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";

export const URL_PARAMS_VERSION_NAME = "v";

export function setDefaultParams(urlSearchParams) {
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

function useSearchRouter() {
    const router = useRouter();

    function replace(urlSearchParams, options) {
        const newUrlSearchParams = setDefaultParams(urlSearchParams);
        router.replace(`/?${newUrlSearchParams.toString()}`, options);
    }

    function push(urlSearchParams, options) {
        const newUrlSearchParams = setDefaultParams(urlSearchParams);
        router.push(`/?${newUrlSearchParams.toString()}`, options);
    }

    return {
        replace,
        push,
    };
}

export default useSearchRouter;
