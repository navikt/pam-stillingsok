import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";

export const MAX_LOCATION_OPTIONS = 100;

export type LocationKind = "county" | "municipal" | "abroad";

export type LocationOption = {
    readonly value: string;
    readonly label: string;
    readonly kind: LocationKind;
};

export const buildLocationOptions = (locations: readonly SearchLocation[]): LocationOption[] => {
    const options: LocationOption[] = [];

    for (const county of locations) {
        if (county.key === "UTLAND") {
            options.push({ value: "UTLAND", label: "Utland", kind: "abroad" });
            continue;
        }

        options.push({
            value: county.key,
            label: `${county.label} (fylke)`,
            kind: "county",
        });

        for (const municipal of county.municipals) {
            options.push({
                value: municipal.key,
                label: `${municipal.label} (kommune)`,
                kind: "municipal",
            });
        }
    }

    return options;
};

export const filterLocationOptions = (options: readonly LocationOption[], inputValue: string): LocationOption[] => {
    const query = inputValue.trim().toLowerCase();

    const filtered =
        query.length === 0
            ? options
            : options.filter((option) => {
                  return option.label.toLowerCase().includes(query);
              });

    return filtered.slice(0, MAX_LOCATION_OPTIONS);
};

export const createOptionByValueMap = (options: readonly LocationOption[]): ReadonlyMap<string, LocationOption> => {
    const map = new Map<string, LocationOption>();
    for (const option of options) {
        map.set(option.value, option);
    }
    return map;
};
