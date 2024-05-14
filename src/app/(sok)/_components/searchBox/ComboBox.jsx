import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "@/app/(sok)/_utils/queryReducer";

function ComboBox({ q, dispatch }) {
    const [value, setValue] = useState("");
    const mockPersistUserAddedValues = (option, isSelected) => {
        console.log("custom option", { option, isSelected });
    };

    const initialSelectedOptions = q && q.length > 0 ? q.split(" ") : [];

    const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);

    const initialOptions = [
        "tea",
        "coffee",
        "hot chocolate",
        "lemonade",
        "orange juice",
        "apple juice",
        "smoothie",
        "milk",
        "water",
        "soda",
        "beer",
        "wine",
    ];

    const filteredOptions = useMemo(() => initialOptions.filter((option) => option.includes(value)), [value]);

    const onToggleSelected = (option, isSelected, isCustomOption) => {
        if (isSelected) {
            setSelectedOptions([...selectedOptions, option]);
            const searchString = [...selectedOptions, option].join(" ");
            dispatch({ type: SET_SEARCH_STRING, value: searchString });
        } else {
            const searchString = selectedOptions.filter((o) => o !== option);
            setSelectedOptions(searchString);
            dispatch({ type: SET_SEARCH_STRING, value: searchString.join(" ") });
        }
        if (isCustomOption) {
            mockPersistUserAddedValues(option, isSelected);
        }
    };

    // TODO: add clearButton && clearButtonLabel="Fjern alle"
    return (
        <Combobox
            allowNewValues
            label="Ko-ko-kombobox"
            filteredOptions={filteredOptions}
            isMultiSelect
            onChange={(event) => setValue(event?.target.value || "")}
            onToggleSelected={onToggleSelected}
            selectedOptions={selectedOptions}
            options={initialOptions}
            value={value}
            name="q"
        />
    );
}

ComboBox.propTypes = {
    q: PropTypes.string,
    // q: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default ComboBox;
