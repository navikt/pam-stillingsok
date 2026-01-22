import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
    Box,
    ExpansionCard,
    HGrid,
    Hide,
    Stack,
    Select,
    Show,
    UNSAFE_Combobox as Combobox,
    VStack,
    Heading,
} from "@navikt/ds-react";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LocationPinIcon } from "@navikt/aksel-icons";
import {
    DISTANCE_PARAM_NAME,
    DISTANCE_VALUES,
    PAGE_PARAM_NAME,
    POSTCODE_PARAM_NAME,
} from "@/app/sommerjobb-test/_utils/constants";
import { getDistanceValueOrDefault } from "@/app/sommerjobb-test/_utils/getDistanceValueOrDefault";

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
                            <Stack as="span" wrap={false} gap={{ xs: "space-8", sm: "space-16" }} align="center">
                                <LocationPinIcon aria-hidden fontSize="2rem" />
                                {headerText}
                            </Stack>
                        </ExpansionCard.Title>
                    </ExpansionCard.Header>
                    <ExpansionCard.Content>{children}</ExpansionCard.Content>
                </ExpansionCard>
            </Show>
            <Hide below="md">
                <VStack align="center">
                    <Heading align="center" level="2" size="small" className="mb-4">
                        {headerText}
                    </Heading>
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

        // Make sure the selected postcode is always shown, and that it's only shown once at the top of list
        if (selectedPostcode.length > 0) {
            const selectedPostcodeOption = selectedPostcode[0] as ComboboxOption;

            if (
                selectedPostcodeOption.value &&
                !filteredOptions.some((option) => option.value === selectedPostcodeOption.value)
            ) {
                filteredOptions.unshift(selectedPostcodeOption);
            } else {
                filteredOptions = filteredOptions.filter((option) => option.value !== selectedPostcodeOption.value);
                filteredOptions.unshift(selectedPostcodeOption);
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

    const distance = getDistanceValueOrDefault(searchParams.get(DISTANCE_PARAM_NAME));

    return (
        <Wrapper headerText="I nærheten av..." defaultOpen={searchParams.has(POSTCODE_PARAM_NAME)}>
            <HGrid gap="space-16" columns={{ xs: 1, md: "340px 192px" }}>
                <Combobox
                    disabled={postCodesFetchFailed}
                    label="Skriv sted eller postnummer"
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
                    value={distance}
                    label="Maks reiseavstand"
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
