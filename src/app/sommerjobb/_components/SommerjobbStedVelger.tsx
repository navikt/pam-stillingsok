import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import SommerjobbStedVelgerWrapper from "@/app/sommerjobb/_components/SommerjobbStedVelgerWrapper";
import {
    buildLocationOptions,
    createOptionByValueMap,
    filterLocationOptions,
    type LocationOption,
} from "@/app/sommerjobb/_utils/locationOptions";
import {
    COUNTY_PARAM,
    MUNICIPAL_PARAM,
    deriveCountyKeyFromMunicipalKey,
    readLocationQueryState,
    normalizeLocationQueryState,
} from "@/app/sommerjobb/_utils/locationQueryParams";

type QueryParamUpdate = {
    readonly name: string;
    readonly value: string | null;
};

type SommerjobbFilterProps = {
    readonly locations: readonly SearchLocation[];
};

function SommerjobbStedVelger({ locations }: SommerjobbFilterProps): ReactElement {
    const [inputValue, setInputValue] = useState<string>("");
    const [selectedOption, setSelectedOption] = useState<LocationOption | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const locationsFetchFailed = locations.length < 1;

    const replaceQueryParams = useCallback(
        (updates: readonly QueryParamUpdate[]) => {
            const params = new URLSearchParams(searchParams.toString());

            for (const update of updates) {
                const nextValue = update.value?.trim() ?? "";
                if (nextValue.length > 0) {
                    params.set(update.name, nextValue);
                } else {
                    params.delete(update.name);
                }
            }

            params.delete(PAGE_PARAM_NAME);

            const queryString = params.toString();
            const href = queryString.length > 0 ? `${pathname}?${queryString}` : pathname;

            router.replace(href, { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const setLocationQueryParams = useCallback(
        (input: { readonly county: string | null; readonly municipal: string | null }) => {
            replaceQueryParams([
                { name: COUNTY_PARAM, value: input.county },
                { name: MUNICIPAL_PARAM, value: input.municipal },
            ]);
        },
        [replaceQueryParams],
    );

    const allOptions = useMemo(() => {
        return buildLocationOptions(locations);
    }, [locations]);

    const optionByValue = useMemo(() => {
        return createOptionByValueMap(allOptions);
    }, [allOptions]);

    const filteredOptions = useMemo(() => {
        return filterLocationOptions(allOptions, inputValue);
    }, [allOptions, inputValue]);

    useEffect(() => {
        const rawState = readLocationQueryState(new URLSearchParams(searchParams.toString()));
        const normalized = normalizeLocationQueryState(rawState);

        if (normalized.municipal) {
            const option = optionByValue.get(normalized.municipal) ?? null;
            setSelectedOption(option);

            if (normalized.county && normalized.county !== rawState.county) {
                setLocationQueryParams({ county: normalized.county, municipal: normalized.municipal });
            }
            return;
        }

        if (normalized.county) {
            const option = optionByValue.get(normalized.county) ?? null;
            setSelectedOption(option);
            return;
        }

        setSelectedOption(null);
    }, [optionByValue, searchParams, setLocationQueryParams]);

    const onToggleSelected = useCallback(
        (value: string, isSelected: boolean) => {
            if (!isSelected) {
                setSelectedOption(null);
                setLocationQueryParams({ county: null, municipal: null });
                return;
            }

            const option = optionByValue.get(value) ?? null;

            if (!option) {
                return;
            }

            setSelectedOption(option);

            if (option.kind === "county") {
                setLocationQueryParams({ county: option.value, municipal: null });
                return;
            }

            if (option.kind === "municipal") {
                const derivedCounty = deriveCountyKeyFromMunicipalKey(option.value);
                setLocationQueryParams({ county: derivedCounty, municipal: option.value });
                return;
            }

            setLocationQueryParams({ county: null, municipal: null });
        },
        [optionByValue, setLocationQueryParams],
    );

    const onChange = useCallback((nextValue: string) => {
        setInputValue(nextValue);
    }, []);

    return (
        <SommerjobbStedVelgerWrapper
            headerText="I nærheten av..."
            defaultOpen={searchParams.has(COUNTY_PARAM) || searchParams.has(MUNICIPAL_PARAM)}
        >
            <Combobox
                disabled={locationsFetchFailed}
                label="Skriv hvor du vil jobbe"
                onChange={onChange}
                options={allOptions}
                onToggleSelected={onToggleSelected}
                filteredOptions={filteredOptions}
                isMultiSelect={false}
                selectedOptions={selectedOption ? [selectedOption] : []}
                shouldAutocomplete={true}
            />
        </SommerjobbStedVelgerWrapper>
    );
}

export default SommerjobbStedVelger;
