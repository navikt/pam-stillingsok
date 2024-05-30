import { containsOldOccupations, rewriteOccupationSearchParams } from "@/app/(sok)/_utils/occupationChanges";

export function migrateToV1(searchParams) {
    let newSearchParams = searchParams;

    // V1 changes some occupations to new ones.
    // After changing, users might still access a search with their old occupations due to saved searches and bookmarks.
    if (containsOldOccupations(searchParams)) {
        newSearchParams = rewriteOccupationSearchParams(newSearchParams);
    }

    return newSearchParams;
}
