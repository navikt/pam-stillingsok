export function migrateToV3(searchParams: URLSearchParams) {
    const migratedSearchParams = new URLSearchParams(searchParams.toString());

    if (migratedSearchParams.has("fields") && migratedSearchParams.get("fields") === "occupation") {
        const qParam = migratedSearchParams.get("q");
        if (qParam) {
            migratedSearchParams.set("occupation", qParam);
        }
        migratedSearchParams.delete("q");
        migratedSearchParams.delete("fields");
    }
    return migratedSearchParams;
}
