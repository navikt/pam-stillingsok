import { buildLocationOptions, type LocationOption } from "@/app/_common/geografi/locationOptions";
import { normalizeLocationQueryState } from "@/app/_common/geografi/locationQueryParams";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";
import { WIZARD_COUNTIES } from "./sokehjelperConstants";

const MUNICIPAL_SUFFIX = " (kommune)";

export const HVOR_SOM_HELST_OPTION = { value: "hvor-som-helst", label: "Hvor som helst" } as const;

type StedState = {
    readonly county: string | null;
    readonly municipal: string | null;
};

function fallbackLocations(): SearchLocation[] {
    return WIZARD_COUNTIES.map((county) => ({ key: county.key, label: county.label, code: "", municipals: [] }));
}

function disambiguateDuplicateLabels(options: readonly LocationOption[]): LocationOption[] {
    const labelCounts = new Map<string, number>();
    for (const option of options) {
        labelCounts.set(option.label, (labelCounts.get(option.label) ?? 0) + 1);
    }

    return options.map((option) => {
        const isDuplicate = (labelCounts.get(option.label) ?? 0) > 1;
        if (!isDuplicate || option.kind !== "municipal" || !option.label.endsWith(MUNICIPAL_SUFFIX)) {
            return option;
        }
        const name = option.label.slice(0, -MUNICIPAL_SUFFIX.length);
        const county = fixLocationName(option.value.split(".")[0]);
        return { ...option, label: `${name} (kommune i ${county})` };
    });
}

export function buildStedOptions(locations: readonly SearchLocation[]): LocationOption[] {
    const source = locations.length > 0 ? locations : fallbackLocations();
    const options = buildLocationOptions(source).filter((option) => option.kind !== "abroad");
    return disambiguateDuplicateLabels(options);
}

function isCountyLike(option: LocationOption): boolean {
    return option.kind === "county" || (option.aliases?.length ?? 0) > 0;
}

export function getFylkeOptions(options: readonly LocationOption[]): LocationOption[] {
    return options.filter(isCountyLike);
}

export function toStedState(option: LocationOption): StedState {
    if (option.kind === "county") {
        return { county: option.value, municipal: null };
    }
    const alias = option.aliases?.[0];
    if (alias) {
        return { county: alias, municipal: null };
    }
    const normalized = normalizeLocationQueryState({ county: null, municipal: option.value });
    return normalized.municipal ? normalized : { county: null, municipal: null };
}
