import React, { useEffect, useState } from "react";
import { Select, UNSAFE_Combobox } from "@navikt/ds-react";
import { ADD_DISTANCE, ADD_POSTCODE, REMOVE_DISTANCE, REMOVE_POSTCODE } from "@/app/(sok)/_utils/queryReducer";

function DrivingDistance({ query, dispatch }) {
    const [selectedPostcode, setSelectedPostcode] = useState((query.postcode && [query.postcode]) || []);
    const [filteredPostcodeOptions, setFilteredPostcodeOptions] = useState([]);

    const allPostcodeOptions = [
        { value: "0010", label: "0010 Oslo" },
        { value: "0015", label: "0015 Oslo 2" },
        { value: "0030", label: "0030 Idk" },
        { value: "1000", label: "1000 Hej" },
        { value: "2000", label: "2000 Hej hej" },
    ];

    for (let i = 31; i < 100; i += 1) {
        allPostcodeOptions.push({ value: `00${i}`, label: `00${i} Oslo 11` });
    }

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
