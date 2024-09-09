import React, { ReactElement, useEffect, useState } from "react";
import { BodyShort, Button, Fieldset, Select, UNSAFE_Combobox } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import "./DrivingDistance.css";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { DISTANCE, POSTCODE } from "@/app/(sok)/_components/searchParamNames";

interface DrivingDistanceProps {
    postcodes: Postcode[];
}

function DrivingDistance({ postcodes }: DrivingDistanceProps): ReactElement {
    const searchQuery = useSearchQuery();
    const [selectedPostcode, setSelectedPostcode] = useState<ComboboxOption[] | string[]>(searchQuery.getAll(POSTCODE));
    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState<ComboboxOption[]>([]);
    const showResetFilterButton = selectedPostcode.length > 0 || searchQuery.has(POSTCODE) || searchQuery.has(DISTANCE);

    const allPostcodeOptions = postcodes.map((data) => ({
        value: data.postcode,
        label: `${data.postcode} ${data.city}`,
    }));

    useEffect(() => {
        if (!searchQuery.has(POSTCODE)) {
            setSelectedPostcode([]);
        } else {
            const postcodeOption = allPostcodeOptions.find((postcode) => postcode.value === searchQuery.get(POSTCODE));

            if (postcodeOption) {
                setSelectedPostcode([postcodeOption]);
            } else {
                setSelectedPostcode([]);
            }
        }
    }, [searchQuery.urlSearchParams]);

    useEffect(() => {
        filterPostcodes();
    }, [selectedPostcode]);

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

    function handlePostCodeChange(option: string, isSelected: boolean): void {
        if (isSelected) {
            searchQuery.set(POSTCODE, option);
        } else {
            searchQuery.remove(POSTCODE);
        }
        logFilterChanged({
            name: "Reisevei",
            value: option || (selectedPostcode[0] as ComboboxOption).value,
            level: "Postnummer",
            checked: isSelected && !!searchQuery.get(DISTANCE),
        });
    }

    function handleDistanceChange(value: string | undefined): void {
        const hasNoValue = value === undefined || value === "";
        if (hasNoValue) {
            searchQuery.remove(DISTANCE);
        } else {
            searchQuery.set(DISTANCE, value);
        }
        logFilterChanged({
            name: "Reisevei",
            value: value || searchQuery.get(DISTANCE),
            level: "Avstand",
            checked: !hasNoValue && selectedPostcode.length > 0,
        });
    }

    function resetDistanceFilters(): void {
        searchQuery.remove(POSTCODE);
        searchQuery.remove(DISTANCE);
    }

    return (
        <Fieldset
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter sted
                </BodyShort>
            }
            className="FilterModal__fieldset mt-2"
        >
            <UNSAFE_Combobox
                label="Fra sted eller postnummer"
                className="Combobox"
                options={allPostcodeOptions}
                filteredOptions={filteredPostcodeOptions}
                onToggleSelected={handlePostCodeChange}
                onChange={filterPostcodes}
                selectedOptions={selectedPostcode}
                shouldAutocomplete
            />
            <div className="mt-4">
                <div className="display-inline-block">
                    <Select
                        size="medium"
                        onChange={(e) => handleDistanceChange(e.target.value)}
                        value={searchQuery.get(DISTANCE) || ""}
                        label="Maks reiseavstand"
                    >
                        <option key="0" value="">
                            Velg avstand
                        </option>
                        {[1, 3, 5, 7, 10, 20, 30, 50, 75, 100, 150].map((km) => (
                            <option key={km} value={km}>
                                {km} kilometer
                            </option>
                        ))}
                    </Select>
                </div>
            </div>
            {showResetFilterButton && (
                <Button
                    type="button"
                    variant="tertiary"
                    onClick={resetDistanceFilters}
                    icon={<TrashIcon aria-hidden="true" />}
                    className="mt-4"
                >
                    Nullstill reisevei
                </Button>
            )}
        </Fieldset>
    );
}

export default DrivingDistance;
