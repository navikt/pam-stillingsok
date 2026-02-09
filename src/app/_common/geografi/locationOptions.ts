import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";

export const MAX_LOCATION_OPTIONS = 100;

export type LocationKind = "county" | "municipal" | "abroad";

export type LocationOption = {
    readonly value: string;
    readonly label: string;
    readonly kind: LocationKind;
    /**
     * Ekstra “nøkler” som skal peke på samme option.
     * Brukes f.eks. når Oslo kun vises én gang (value=OSLO.OSLO),
     * men vi fortsatt vil at county=OSLO skal finne samme option.
     */
    readonly aliases?: readonly string[];
};

const normalizeForCompare = (value: string): string => {
    return value.trim().toLocaleLowerCase("nb-NO");
};

const canMergeCountyAndMunicipal = (county: SearchLocation): boolean => {
    if (county.key === "UTLAND") {
        return false;
    }

    if (county.municipals.length !== 1) {
        return false;
    }

    const onlyMunicipal = county.municipals[0];
    if (!onlyMunicipal) {
        return false;
    }

    // Merge når fylke og kommune har samme label (Oslo)
    return normalizeForCompare(county.label) === normalizeForCompare(onlyMunicipal.label);
};

export const buildLocationOptions = (locations: readonly SearchLocation[]): LocationOption[] => {
    const options: LocationOption[] = [];

    for (const county of locations) {
        if (county.key === "UTLAND") {
            options.push({ value: "UTLAND", label: "Utland", kind: "abroad" });
            continue;
        }

        if (canMergeCountyAndMunicipal(county)) {
            const onlyMunicipal = county.municipals[0];

            options.push({
                value: onlyMunicipal.key, // f.eks. "OSLO.OSLO"
                label: `${county.label}`, // "Oslo"
                kind: "municipal",
                aliases: [county.key], // gjør at "OSLO" i URL fortsatt matcher samme option
            });

            continue;
        }

        options.push({
            value: county.key,
            label: `${county.label} (fylke)`,
            kind: "county",
        });

        for (const municipal of county.municipals) {
            options.push({
                value: municipal.key, // f.eks. "TROMS.TROMSØ"
                label: `${municipal.label} (kommune)`, // "Tromsø"
                kind: "municipal",
            });
        }
    }

    return options;
};

export const filterLocationOptions = (options: readonly LocationOption[], inputValue: string): LocationOption[] => {
    const query = inputValue.trim().toLocaleLowerCase("nb-NO");

    if (query.length === 0) {
        return options.slice(0, MAX_LOCATION_OPTIONS);
    }

    const filtered = options.filter((option) => {
        const label = option.label.toLocaleLowerCase("nb-NO");

        if (label.includes(query)) {
            return true;
        }

        if (option.kind === "county") {
            const countyKey = option.value.toLocaleLowerCase("nb-NO");
            return countyKey.includes(query);
        }

        if (option.kind === "municipal") {
            // value er "FYLKE.KOMMUNE" – vi matcher kun kommune-delen for å unngå at "troms"
            // gir alle kommuner i Troms
            const parts = option.value.split(".", 2);
            const municipalPart = (parts[1] ?? "").toLocaleLowerCase("nb-NO");
            return municipalPart.includes(query);
        }

        return false;
    });

    return filtered.slice(0, MAX_LOCATION_OPTIONS);
};

export const createOptionByValueMap = (options: readonly LocationOption[]): ReadonlyMap<string, LocationOption> => {
    const map = new Map<string, LocationOption>();

    for (const option of options) {
        map.set(option.value, option);

        const aliases = option.aliases ?? [];
        for (const alias of aliases) {
            // Ikke overskriv eksisterende keys (trygt hvis en key finnes fra før)
            if (!map.has(alias)) {
                map.set(alias, option);
            }
        }
    }

    return map;
};
