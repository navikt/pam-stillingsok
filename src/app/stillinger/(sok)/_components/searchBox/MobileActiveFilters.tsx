"use client";

import { Chips, Show } from "@navikt/ds-react";
import { useMemo } from "react";
import { track } from "@/app/_common/umami";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import {
    buildSelectedOptions,
    type SelectedSearchOption,
} from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import { removeSelectedFilter } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxFilterActions";

function MobileActiveFilters() {
    const query = useQuery();
    const urlSearchParamsString = query.urlSearchParams.toString();

    const selectedOptions = useMemo(() => {
        const urlSearchParams = new URLSearchParams(urlSearchParamsString);

        return buildSelectedOptions(urlSearchParams);
    }, [urlSearchParamsString]);

    const removeSelectedOption = (option: SelectedSearchOption) => {
        query.update(
            (draft) => {
                removeSelectedFilter(draft, option.queryKey, option.queryValue);
            },
            {
                changedKey: option.queryKey,
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
                    <Chips.Removable
                        key={`${option.queryKey}-${option.queryValue}`}
                        onDelete={() => removeSelectedOption(option)}
                    >
                        {option.label}
                    </Chips.Removable>
                ))}
                {selectedOptions.length > 1 && (
                    <Chips.Toggle
                        checkmark={false}
                        onClick={() => {
                            track("Klikk - Fjern alle filtre", { enhet: "mobil" });
                            query.reset();
                        }}
                    >
                        Fjern alle
                    </Chips.Toggle>
                )}
            </Chips>
        </Show>
    );
}

export default MobileActiveFilters;
