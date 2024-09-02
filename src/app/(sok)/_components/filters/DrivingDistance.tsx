import React, { Dispatch, ReactElement, useEffect, useState } from "react";
import { BodyShort, Button, Fieldset, Select, UNSAFE_Combobox } from "@navikt/ds-react";
import { ADD_DISTANCE, ADD_POSTCODE, REMOVE_DISTANCE, REMOVE_POSTCODE } from "@/app/(sok)/_utils/queryReducer";
import { TrashIcon } from "@navikt/aksel-icons";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import "./DrivingDistance.css";

// TODO: Replace when TS query interface has been merged
interface DrivingDistanceQueryProps {
    postcode: string | null;
    distance: number | null;
}

export interface DispatchProps {
    type: string;
    value?: string | number;
}

interface DrivingDistanceProps {
    query: DrivingDistanceQueryProps;
    dispatch: Dispatch<DispatchProps>;
    postcodes: Postcode[];
}

function DrivingDistance({ query, dispatch, postcodes }: DrivingDistanceProps): ReactElement {
    const [selectedPostcode, setSelectedPostcode] = useState<ComboboxOption[] | string[]>(
        (query.postcode && [query.postcode]) || [],
    );
    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState<ComboboxOption[]>([]);
    const showResetFilterButton = selectedPostcode.length > 0 || query.postcode || query.distance;

    const allPostcodeOptions = postcodes.map((data) => ({
        value: data.postcode,
        label: `${data.postcode} ${data.city}`,
    }));

    useEffect(() => {
        if (!query.postcode) {
            setSelectedPostcode([]);
        } else {
            const postcodeOption = allPostcodeOptions.find((postcode) => postcode.value === query.postcode);

            if (postcodeOption) {
                setSelectedPostcode([postcodeOption]);
            } else {
                setSelectedPostcode([]);
            }
        }
    }, [query.postcode]);

    useEffect(() => {
        filterPostcodes();
    }, [selectedPostcode]);

    function filterPostcodes(value: string | undefined = undefined) {
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

    function handlePostCodeChange(option: string, isSelected: boolean) {
        if (isSelected) {
            dispatch({ type: ADD_POSTCODE, value: option });
        } else {
            dispatch({ type: REMOVE_POSTCODE });
        }
    }

    function handleDistanceChange(value: string | null) {
        if (value === null || value === undefined || value === "") {
            dispatch({ type: REMOVE_DISTANCE });
        } else {
            dispatch({ type: ADD_DISTANCE, value });
        }
    }

    function resetDistanceFilters() {
        dispatch({ type: REMOVE_POSTCODE });
        dispatch({ type: REMOVE_DISTANCE });
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
                        value={query.distance || ""}
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
