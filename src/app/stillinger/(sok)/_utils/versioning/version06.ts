import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

const experienceMigrations: Record<string, string> = {
    Ingen: "ingen krav til arbeidserfaring",
    Noe: "noe arbeidserfaring",
    Mye: "mye arbeidserfaring",
};

export function migrateToV6(searchParams: URLSearchParams): URLSearchParams {
    const migratedSearchParams = new URLSearchParams(searchParams.toString());
    const values = migratedSearchParams.getAll(QueryNames.EXPERIENCE);

    if (values.length === 0) {
        return migratedSearchParams;
    }

    migratedSearchParams.delete(QueryNames.EXPERIENCE);

    for (const value of values) {
        migratedSearchParams.append(QueryNames.EXPERIENCE, experienceMigrations[value] ?? value);
    }

    return migratedSearchParams;
}
