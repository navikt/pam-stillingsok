"use client";

import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Box, ExpansionCard, HGrid, Hide, Select, Show, UNSAFE_Combobox as Combobox, VStack } from "@navikt/ds-react";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    DISTANCE_PARAM_NAME,
    DISTANCE_VALUES,
    PAGE_PARAM_NAME,
    POSTCODE_PARAM_NAME,
    DEFAULT_DISTANCE,
} from "@/app/sommerjobb/_components/constants";

interface WrapperProps {
    children: React.ReactNode;
    headerText: string;
    defaultOpen?: boolean;
}

function Wrapper({ children, headerText, defaultOpen = false }: WrapperProps): ReactElement {
    return (
        <>
            <Show below="md">
                <ExpansionCard aria-label={headerText} defaultOpen={defaultOpen}>
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
    const postCodesFetchFailed = postcodes.length < 1;

    const allPostcodeOptions = postcodes.map((data) => ({
        value: data.postcode,
        label: `${data.postcode} ${data.city}`,
    }));

    const postCodeFromQuery = allPostcodeOptions.find(
        (postcode) => postcode.value === searchParams.get(POSTCODE_PARAM_NAME),
    );

    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState<ComboboxOption[]>([]);
    const [selectedPostcode, setSelectedPostcode] = useState<ComboboxOption[] | string[]>(
        postCodeFromQuery ? ([postCodeFromQuery] as ComboboxOption[]) : [],
    );

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
            router.replace(pathname + "?" + params.toString(), { scroll: false });
        },
        [searchParams, pathname, router],
    );

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
            } else {
                //TODO: move selected postcodeoption in filteredOptions to the top of the list
            }
        }

        setFilteredPostcodeOptions(filteredOptions);
    }

    function handlePostCodeChange(option: string, isSelected: boolean): void {
        if (isSelected) {
            const postcodeOption = allPostcodeOptions.find((postcode) => postcode.value === option);

            if (postcodeOption) {
                setSelectedPostcode([postcodeOption]);
            }
            setQueryParam(POSTCODE_PARAM_NAME, option);
        } else {
            setSelectedPostcode([]);
            setQueryParam(POSTCODE_PARAM_NAME, "");
        }
    }

    return (
        <Wrapper
            headerText="I nærheten av..."
            defaultOpen={searchParams.has(DISTANCE_PARAM_NAME) || searchParams.has(POSTCODE_PARAM_NAME)}
        >
            <HGrid gap="4" columns={{ xs: 1, md: "340px 192px" }}>
                <Combobox
                    disabled={postCodesFetchFailed}
                    label="Velg sted eller postnummer"
                    onChange={filterPostcodes}
                    options={allPostcodeOptions}
                    onToggleSelected={handlePostCodeChange}
                    filteredOptions={filteredPostcodeOptions}
                    selectedOptions={selectedPostcode}
                ></Combobox>
                <Select
                    disabled={postCodesFetchFailed}
                    size="medium"
                    onChange={(e) => {
                        setQueryParam(DISTANCE_PARAM_NAME, e.target.value);
                    }}
                    value={searchParams.get(DISTANCE_PARAM_NAME) || DEFAULT_DISTANCE}
                    label="Velg maks reiseavstand"
                >
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
