import type { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

export function isKnownQueryName(potentialKey: string): boolean {
    return (Object.values(QueryNames) as string[]).includes(potentialKey);
}

export function parseOption(option: string): Readonly<{
    key?: string;
    value: string;
}> {
    const dashIndex = option.indexOf("-");
    if (dashIndex === -1) {
        return {
            value: option,
        };
    }
    const potentialKey = option.slice(0, dashIndex);
    if (isKnownQueryName(potentialKey)) {
        return {
            key: potentialKey,
            value: option.slice(dashIndex + 1),
        };
    }
    return {
        value: option,
    };
}

export function appendIfMissing(searchParams: URLSearchParams, key: string, value: string): void {
    if (!searchParams.getAll(key).includes(value)) {
        searchParams.append(key, value);
    }
}

export function retainSelectedCustomOptions(
    customOptions: readonly ComboboxOption[],
    selectedOptions: readonly ComboboxOption[],
): readonly ComboboxOption[] {
    const selectedValues = new Set(selectedOptions.map((option) => option.value));
    const retainedOptions = customOptions.filter((option) => selectedValues.has(option.value));

    return retainedOptions.length === customOptions.length ? customOptions : retainedOptions;
}

export function removeSelectedFilter(draft: URLSearchParams, key: string, value: string): void {
    if (key === QueryNames.INTERNATIONAL) {
        draft.delete(QueryNames.INTERNATIONAL);
        return;
    }

    if (key === QueryNames.MUNICIPAL) {
        draft.delete(QueryNames.MUNICIPAL, value);

        const county = value.split(".")[0];
        const remainingMunicipalsInCounty = draft.getAll(QueryNames.MUNICIPAL).filter((municipal) => {
            return municipal.startsWith(`${county}.`);
        });

        if (remainingMunicipalsInCounty.length === 0) {
            draft.delete(QueryNames.COUNTY, county);
        }

        return;
    }

    if (key === QueryNames.COUNTRY) {
        draft.delete(QueryNames.COUNTRY, value);

        const remainingCountries = draft.getAll(QueryNames.COUNTRY);

        if (remainingCountries.length === 0) {
            draft.delete(QueryNames.INTERNATIONAL);
        }

        return;
    }

    if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
        draft.delete(QueryNames.OCCUPATION_SECOND_LEVEL, value);

        const firstLevel = value.split(".")[0];
        const remainingOccupationsInCategory = draft
            .getAll(QueryNames.OCCUPATION_SECOND_LEVEL)
            .filter((secondLevel) => {
                return secondLevel.startsWith(`${firstLevel}.`);
            });

        if (remainingOccupationsInCategory.length === 0) {
            draft.delete(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel);
        }

        return;
    }

    draft.delete(key, value);
}
