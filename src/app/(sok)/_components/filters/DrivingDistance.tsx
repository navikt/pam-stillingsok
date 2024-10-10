import React, { ReactElement, useEffect, useState } from "react";
import { Alert, BodyShort, Button, Fieldset, Select, UNSAFE_Combobox } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import "./DrivingDistance.css";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_components/QueryNames";
import { FETCH_POSTCODES_ERROR, FetchError } from "@/app/(sok)/_utils/fetchTypes";

interface DrivingDistanceProps {
    postcodes: Postcode[];
    errors: FetchError[];
}

function DrivingDistance({ postcodes, errors }: DrivingDistanceProps): ReactElement {
    const query = useQuery();
    const [selectedPostcode, setSelectedPostcode] = useState<ComboboxOption[] | string[]>(
        query.getAll(QueryNames.POSTCODE),
    );
    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState<ComboboxOption[]>([]);
    const showResetFilterButton =
        selectedPostcode.length > 0 || query.has(QueryNames.POSTCODE) || query.has(QueryNames.DISTANCE);

    const allPostcodeOptions = postcodes.map((data) => ({
        value: data.postcode,
        label: `${data.postcode} ${data.city}`,
    }));

    useEffect(() => {
        if (!query.has(QueryNames.POSTCODE)) {
            setSelectedPostcode([]);
        } else {
            const postcodeOption = allPostcodeOptions.find(
                (postcode) => postcode.value === query.get(QueryNames.POSTCODE),
            );

            if (postcodeOption) {
                setSelectedPostcode([postcodeOption]);
            } else {
                setSelectedPostcode([]);
            }
        }
    }, [query.urlSearchParams]);

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
            query.set(QueryNames.POSTCODE, option);
        } else {
            query.remove(QueryNames.POSTCODE);
        }
        logFilterChanged({
            name: "Reisevei",
            value: option || (selectedPostcode[0] as ComboboxOption).value,
            level: "Postnummer",
            checked: isSelected && !!query.get(QueryNames.DISTANCE),
        });
    }

    function handleDistanceChange(value: string | undefined): void {
        const hasNoValue = value === undefined || value === "";
        if (hasNoValue) {
            query.remove(QueryNames.DISTANCE);
        } else {
            query.set(QueryNames.DISTANCE, value);
        }
        logFilterChanged({
            name: "Reisevei",
            value: value || query.get(QueryNames.DISTANCE),
            level: "Avstand",
            checked: !hasNoValue && selectedPostcode.length > 0,
        });
    }

    function resetDistanceFilters(): void {
        query.remove(QueryNames.POSTCODE);
        query.remove(QueryNames.DISTANCE);
    }

    const failedToFetchPostcodes =
        errors.length > 0 && errors.find((error) => error.type === FETCH_POSTCODES_ERROR) !== undefined;

    return (
        <Fieldset
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter sted
                </BodyShort>
            }
            className="FilterModal__fieldset mt-2"
        >
            {failedToFetchPostcodes && (
                <Alert variant="warning" className="mb-4" inline>
                    Reisevei-filteret er midlertidig utilgjengelig og påvirker ikke søkeresultatene. For å avgrense
                    søket, bruk kommune- eller fylkesfilteret.
                </Alert>
            )}
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
                        value={query.get(QueryNames.DISTANCE) || ""}
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
