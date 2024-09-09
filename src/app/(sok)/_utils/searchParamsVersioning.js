import { migrateToV1 } from "@/app/(sok)/_utils/versioning/version01";
import { migrateToV2 } from "@/app/(sok)/_utils/versioning/version02";
import { migrateToV3 } from "@/app/(sok)/_utils/versioning/version03";

export const VERSION_QUERY_PARAM = "v";
export const CURRENT_VERSION = 3;
const FIRST_VERSION = 0;

// Returns new search params if the searchParams have been migrated.
export function migrateSearchParams(searchParams) {
    let newSearchParams = searchParams;
    const version = getCurrentVersion(searchParams);

    if (version === CURRENT_VERSION) {
        return undefined;
    }

    let newVersion = 0;

    if (version < 1) {
        newSearchParams = migrateToV1(newSearchParams);
        newVersion = 1;
    }

    if (version < 2) {
        newSearchParams = migrateToV2(newSearchParams);
        newVersion = 2;
    }

    if (version < 3) {
        newSearchParams = migrateToV3(newSearchParams);
        newVersion = 3;
    }

    newSearchParams[VERSION_QUERY_PARAM] = newVersion;

    return newSearchParams;
}

function getCurrentVersion(searchParams) {
    if (hasNoSearchParams(searchParams)) {
        return CURRENT_VERSION;
    }

    const version = searchParams[VERSION_QUERY_PARAM];

    return version ? parseInt(version, 10) : FIRST_VERSION;
}

function hasNoSearchParams(searchParams) {
    return Object.keys(searchParams).length === 0;
}
