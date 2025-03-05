"use client";

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Box, ExpansionCard, HGrid, Hide, Select, Show, UNSAFE_Combobox as Combobox, VStack } from "@navikt/ds-react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DISTANCE_PARAM_NAME, DISTANCE_VALUES, PAGE_PARAM_NAME } from "@/app/sommerjobb/_components/constants";

interface WrapperProps {
    children: React.ReactNode;
    headerText: string;
}

function Wrapper({ children, headerText }: WrapperProps): ReactElement {
    return (
        <>
            <Show below="md">
                <ExpansionCard aria-label={headerText}>
                    <ExpansionCard.Header>
                        <ExpansionCard.Title as="h2" size="small">
                            {headerText}
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>{children}</ExpansionCard.Content>
                </ExpansionCard>
            </Show>
            <Hide below="md">
                <VStack align="center">
                    <Box maxWidth={{ md: "800px" }}>{children}</Box>
                </VStack>
            </Hide>
        </>
    );
}

interface SommerjobbFilterProps {
    postcodes: Postcode[];
}

function SommerjobbDistance({ postcodes }: SommerjobbFilterProps): ReactElement {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState<ComboboxOption[]>([]);
    const [selectedPostcode, setSelectedPostcode] = useState<ComboboxOption[] | string[]>([]);

    useEffect(() => {
        filterPostcodes();
    }, [selectedPostcode]);

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
        <Wrapper headerText="I nærheten av...">
            <HGrid gap="4" columns={{ xs: 1, md: "3fr 2fr" }}>
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
                        setQueryParam(DISTANCE_PARAM_NAME, e.target.value);
                    }}
                    value={searchParams.get(DISTANCE_PARAM_NAME) || ""}
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
        </Wrapper>
    );
}

export default SommerjobbDistance;
