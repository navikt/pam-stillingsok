import { containsOldOccupations, rewriteOccupationSearchParams } from "@/app/(sok)/_utils/occupationChanges";

const changedOccupations = {
    "Kontor og økonomi.Kontor, forvaltning og saksbehandling": ["Kultur og kreative yrker.Museum, bibliotek, arkiv"],
};

export function migrateToV4(searchParams) {
    let newSearchParams = searchParams;

    // V1 changes some occupations to new ones.
    // After changing, users might still access a search with their old occupations due to saved searches and bookmarks.
    if (containsOldOccupations(searchParams, changedOccupations)) {
        newSearchParams = rewriteOccupationSearchParams(newSearchParams, changedOccupations);
    }

    return newSearchParams;
}
