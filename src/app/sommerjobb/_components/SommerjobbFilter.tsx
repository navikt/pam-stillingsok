"use client";

import React, { ReactElement, useId, useCallback, useEffect, useState } from "react";
import { Chips, Heading, HGrid, Select, UNSAFE_Combobox as Combobox, VStack } from "@navikt/ds-react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    AVSTAND_PARAM_NAME,
    DISTANCE_VALUES,
    JOBBE_MED_PARAM_NAME,
    PAGE_PARAM_NAME,
} from "@/app/sommerjobb/_components/constants";

interface SommerjobbFilterProps {
    postcodes: Postcode[];
}

function SommerjobbFilter({ postcodes }: SommerjobbFilterProps): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const jobbMedId = useId();
    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState<ComboboxOption[]>([]);
    const [selectedPostcode, setSelectedPostcode] = useState<ComboboxOption[] | string[]>([]);

    useEffect(() => {
        filterPostcodes();
    }, [selectedPostcode]);

    const appendQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (!params.has(name, value)) {
                params.append(name, value);
            }
            params.delete(PAGE_PARAM_NAME);
            router.push(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const removeQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name, value);
            params.delete(PAGE_PARAM_NAME);
            router.push(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const setQueryParam = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value.length > 0) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            params.delete(PAGE_PARAM_NAME);
            router.push(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

    const allPostcodeOptions = postcodes.map((data) => ({
        value: data.postcode,
        label: `${data.postcode} ${data.city}`,
    }));

    //TODO: possibly write this as a common function
    function filterPostcodes(value: string | undefined = undefined): void {
        let filteredOptions = allPostcodeOptions;

        if (value) {
            const cleanValue = value.toUpperCase().trim();

            if (Number.isNaN(Number(cleanValue))) {
                filteredOptions = allPostcodeOptions.filter((option) => option.label.includes(cleanValue));
            } else {
                filteredOptions = allPostcodeOptions.filter((option) => option.value.startsWith(cleanValue));
            }
        }

        // Limit the shown options, since thousands of options will crash the browser
        filteredOptions = filteredOptions.slice(0, 100);

        // Make sure the selected postcode is always shown, and that it's only shown once
        if (selectedPostcode.length > 0) {
            const selectedPostcodeOption = selectedPostcode[0] as ComboboxOption;

            if (
                selectedPostcodeOption.value &&
                !filteredOptions.some((option) => option.value === selectedPostcodeOption.value)
            ) {
                filteredOptions.unshift(selectedPostcodeOption);
            }
        }

        setFilteredPostcodeOptions(filteredOptions);
    }

    //TODO: handle so selected postcode always is shown on top in the dropdown
    function handlePostCodeChange(option: string, isSelected: boolean): void {
        if (isSelected) {
            setSelectedPostcode([option]);
        } else {
            setSelectedPostcode([]);
        }
    }

    return (
        <section aria-label="Ditt søk">
            <VStack align="center" className="mb-8">
                <Heading id={jobbMedId} level="2" size="small" className="mb-4">
                    Jeg vil jobbe med...
                </Heading>
                <Chips className="justify-content-center" aria-labelledby={jobbMedId}>
                    {[
                        "Butikk",
                        "Helse",
                        "Kontor",
                        "Kultur",
                        "Kundeservice",
                        "Lager og industri",
                        "Renhold",
                        "Restaurant og kafé",
                        "Transport",
                        "Turisme",
                        "Utendørs",
                    ].map((item) => (
                        <Chips.Toggle
                            key={item}
                            selected={searchParams.has(JOBBE_MED_PARAM_NAME, item)}
                            checkmark={true}
                            onClick={() => {
                                searchParams.has(JOBBE_MED_PARAM_NAME, item)
                                    ? removeQueryParam(JOBBE_MED_PARAM_NAME, item)
                                    : appendQueryParam(JOBBE_MED_PARAM_NAME, item);
                            }}
                        >
                            {item}
                        </Chips.Toggle>
                    ))}
                </Chips>
            </VStack>
            <HGrid gap="4" columns={{ xs: 1, sm: 1, md: 2 }}>
                <Combobox
                    label="Velg sted eller postnummer"
                    onChange={filterPostcodes}
                    options={allPostcodeOptions}
                    onToggleSelected={handlePostCodeChange}
                    filteredOptions={filteredPostcodeOptions}
                ></Combobox>
                <Select
                    size="medium"
                    onChange={(e) => {
                        setQueryParam(AVSTAND_PARAM_NAME, e.target.value);
                    }}
                    value={searchParams.get(AVSTAND_PARAM_NAME) || ""}
                    label="Velg maks reiseavstand"
                >
                    <option key="0" value="">
                        Velg avstand
                    </option>
                    {DISTANCE_VALUES.map((km) => (
                        <option key={km} value={km}>
                            {km} kilometer
                        </option>
                    ))}
                </Select>
            </HGrid>
        </section>
    );
}

export default SommerjobbFilter;
