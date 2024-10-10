import { migrateToV1 } from "@/app/(sok)/_utils/versioning/version01";
import { migrateToV2 } from "@/app/(sok)/_utils/versioning/version02";
import { migrateToV3 } from "@/app/(sok)/_utils/versioning/version03";
import { URL_VERSION } from "@/app/(sok)/_components/searchParamNames";

export const CURRENT_VERSION = 3;
const FIRST_VERSION = 0;

export function migrateSearchParams(searchParams) {
    let migratedSearchParams = new URLSearchParams(searchParams.toString());

    const version = searchParams.has(URL_VERSION) ? parseInt(searchParams.get(URL_VERSION), 10) : FIRST_VERSION;

    if (version === CURRENT_VERSION || searchParams.size === 0) {
        return migratedSearchParams;
    }

    if (version < 1) {
        migratedSearchParams = migrateToV1(migratedSearchParams);
    }

    if (version < 2) {
        migratedSearchParams = migrateToV2(migratedSearchParams);
    }

    if (version < 3) {
        migratedSearchParams = migrateToV3(migratedSearchParams);
    }

    if (version < 4) {
        // migratedSearchParams = migrateToV4(newSearchParams);
    }

    migratedSearchParams.set(URL_VERSION, `${CURRENT_VERSION}`);

    return migratedSearchParams;
}
