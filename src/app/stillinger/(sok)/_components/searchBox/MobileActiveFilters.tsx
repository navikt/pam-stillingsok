"use client";

import { Chips, Show } from "@navikt/ds-react";
import { useMemo } from "react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { buildSelectedOptions } from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import ClearAllFiltersButton from "@/app/stillinger/(sok)/_components/searchBox/ClearAllFiltersButton";
import {
    parseOption,
    removeSelectedFilter,
} from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxFilterActions";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

function MobileActiveFilters() {
    const query = useQuery();
    const urlSearchParamsString = query.urlSearchParams.toString();

    const selectedOptions = useMemo(() => {
        const urlSearchParams = new URLSearchParams(urlSearchParamsString);

        return buildSelectedOptions(urlSearchParams);
    }, [urlSearchParamsString]);

    const removeSelectedOption = (rawValue: string) => {
        const parsedOption = parseOption(rawValue);

        query.update(
            (draft) => {
                if (parsedOption.key) {
                    removeSelectedFilter(draft, parsedOption.key, parsedOption.value);
                } else {
                    draft.delete(QueryNames.SEARCH_STRING, parsedOption.value);
                }
            },
            {
                changedKey: parsedOption.key ?? QueryNames.SEARCH_STRING,
            },
        );
    };

    if (selectedOptions.length === 0) {
        return null;
    }

    return (
        <Show below="sm" asChild>
            <Chips aria-label="Aktive filtre">
                {selectedOptions.map((option) => (
                    <Chips.Removable key={option.value} onDelete={() => removeSelectedOption(option.value)}>
                        {option.label}
                    </Chips.Removable>
                ))}
                <ClearAllFiltersButton />
            </Chips>
        </Show>
    );
}

export default MobileActiveFilters;
