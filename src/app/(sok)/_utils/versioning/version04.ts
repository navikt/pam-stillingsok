export function migrateToV4(searchParams: URLSearchParams) {
    const OCCUPATION_FIRST_LEVEL = "occupationLevel1";
    const OCCUPATION_SECOND_LEVEL = "occupationLevel2";

    const migratedSearchParams = new URLSearchParams(searchParams.toString());
    const occupationToBeChanged = "Kontor og økonomi.Kontor, forvaltning og saksbehandling";
    const occupationToAdd = "Kultur og kreative yrker.Museum, bibliotek, arkiv";

    if (
        migratedSearchParams.has(OCCUPATION_SECOND_LEVEL, occupationToBeChanged) &&
        !migratedSearchParams.has(OCCUPATION_SECOND_LEVEL, occupationToAdd)
    ) {
        const firstLevel = occupationToAdd.split(".")[0];
        const shouldAppendFirstLevel = !migratedSearchParams.has(OCCUPATION_FIRST_LEVEL, firstLevel);

        if (shouldAppendFirstLevel) {
            migratedSearchParams.append(OCCUPATION_FIRST_LEVEL, firstLevel);
        }

        migratedSearchParams.append(OCCUPATION_SECOND_LEVEL, occupationToAdd);
    }

    return migratedSearchParams;
}
