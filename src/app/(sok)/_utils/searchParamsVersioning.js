import { containsOldOccupations, rewriteOccupationSearchParams } from "@/app/(sok)/_utils/occupationChanges";

export const VERSION_QUERY_PARAM = "v";
export const CURRENT_VERSION = 1;
const FIRST_VERSION = 0;

// Returns new search params if the searchParams have been migrated.
export function migrateSearchParams(searchParams) {
    let newSearchParams = searchParams;
    const version = getCurrentVersion(searchParams);

    if (version === CURRENT_VERSION) {
        return undefined;
    }

    if (version < 1) {
        newSearchParams = migrateToV1(newSearchParams);
    }

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

function migrateToV1(searchParams) {
    let newSearchParams = searchParams;

    // V1 changes some occupations to new ones.
    // After changing, users might still access a search with their old occupations due to saved searches and bookmarks.
    if (containsOldOccupations(searchParams)) {
        newSearchParams = rewriteOccupationSearchParams(newSearchParams);
    }

    newSearchParams[VERSION_QUERY_PARAM] = 1;

    return newSearchParams;
}
