export function migrateToV5(searchParams: URLSearchParams): URLSearchParams {
    const migratedSearchParams = new URLSearchParams(searchParams.toString());
    const occupationOldValue = "Utdanning.Førskolelærer";
    const occupationNewValue = "Utdanning.Barnehagelærer";
    const OCCUPATION_SECOND_LEVEL = "occupationLevel2";

    if (migratedSearchParams.has(OCCUPATION_SECOND_LEVEL, occupationOldValue)) {
        migratedSearchParams.delete(OCCUPATION_SECOND_LEVEL, occupationOldValue);
        migratedSearchParams.append(OCCUPATION_SECOND_LEVEL, occupationNewValue);
    }

    return migratedSearchParams;
}
