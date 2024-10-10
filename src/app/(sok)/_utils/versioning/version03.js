export function migrateToV3(searchParams) {
    const migratedSearchParams = new URLSearchParams(searchParams.toString());

    if (migratedSearchParams.has("fields") && migratedSearchParams.get("fields") === "occupation") {
        migratedSearchParams.set("occupation", migratedSearchParams.get("q"));
        migratedSearchParams.delete("q");
        migratedSearchParams.delete("fields");
    }
    return migratedSearchParams;
}
