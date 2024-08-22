import React, { useEffect, useState } from "react";
import { Select, UNSAFE_Combobox } from "@navikt/ds-react";
import { ADD_DISTANCE, ADD_POSTCODE, REMOVE_DISTANCE, REMOVE_POSTCODE } from "@/app/(sok)/_utils/queryReducer";

function DrivingDistance({ query, dispatch, postcodes }) {
    const [selectedPostcode, setSelectedPostcode] = useState((query.postcode && [query.postcode]) || []);
    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState([]);

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

        filterPostcodes(null);
    }, [query.postcode]);

    function filterPostcodes(value) {
        let filteredOptions = allPostcodeOptions;

        if (value) {
            filteredOptions = allPostcodeOptions.filter((option) => option.value.startsWith(value));
        }

        // Limit the shown options, since thousands of options will crash the browser
        setFilteredPostcodeOptions(filteredOptions.slice(0, 25));
    }

    function handlePostCodeChange(option, isSelected) {
        if (isSelected) {
            dispatch({ type: ADD_POSTCODE, value: option });
        } else {
            dispatch({ type: REMOVE_POSTCODE });
        }
    }

    function handleDistanceChange(value) {
        if (value === null || value === undefined || value === "") {
            dispatch({ type: REMOVE_DISTANCE });
        } else {
            dispatch({ type: ADD_DISTANCE, value });
        }
    }

    return (
        <div>
            <UNSAFE_Combobox
                label="Fra postnummer"
                options={allPostcodeOptions}
                filteredOptions={filteredPostcodeOptions}
                onToggleSelected={handlePostCodeChange}
                onChange={filterPostcodes}
                selectedOptions={selectedPostcode}
                shouldAutocomplete
            />
            <Select
                className="mt-4"
                onChange={(e) => handleDistanceChange(e.target.value)}
                value={query.distance || ""}
                label="Maks kjøreavstand"
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
    );
}

export default DrivingDistance;
