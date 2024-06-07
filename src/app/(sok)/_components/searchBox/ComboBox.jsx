import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
    REMOVE_COUNTRY,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
    SET_SEARCH_STRING,
} from "@/app/(sok)/_utils/queryReducer";
import {
    removeCountry,
    removeMunicipal,
    removeOccupationSecondLevel,
} from "@/app/(sok)/_components/utils/selectedFiltersUtils";
import { filterAction, getQueryOptions } from "@/app/(sok)/_components/searchBox/optionUtils";

function ComboBox({ query, queryDispatch, onChange, value, allSuggestions, options }) {
    const initialSelectedOptions = useMemo(() => getQueryOptions(query), [query]);

    const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);

    useEffect(() => {
        const newInitialSelectedOptions = getQueryOptions(query);
        setSelectedOptions(newInitialSelectedOptions);
    }, [query]);

    const handleFreeTextSearchOption = (option, isSelected) => {
        if (isSelected) {
            const newSelectedOptions = [...selectedOptions.filter((opt) => !opt.value), option];
            queryDispatch({
                type: SET_SEARCH_STRING,
                value: newSelectedOptions.join(" "),
            });
        } else {
            const selected = selectedOptions.filter((o) => o !== option);
            queryDispatch({ type: SET_SEARCH_STRING, value: selected.filter((opt) => !opt.value).join(" ") });
        }
    };

    const handleFilterRemoval = (filterToRemove, optionValue) => {
        if (filterToRemove === SET_INTERNATIONAL) {
            queryDispatch({ type: filterToRemove, value: false });
        } else if (filterToRemove === SET_PUBLISHED) {
            queryDispatch({ type: filterToRemove, value: undefined });
        } else if (filterToRemove === REMOVE_MUNICIPAL) {
            removeMunicipal(queryDispatch, query, optionValue);
        } else if (filterToRemove === REMOVE_COUNTRY) {
            removeCountry(queryDispatch, query, optionValue);
        } else if (filterToRemove === REMOVE_OCCUPATION_SECOND_LEVEL) {
            removeOccupationSecondLevel(queryDispatch, query, optionValue);
        } else {
            queryDispatch({ type: filterToRemove, value: optionValue });
        }
    };

    const handleFilterOption = (option, isSelected) => {
        const optionValue = option.slice(option.indexOf("-") + 1);
        const optionCategory = option.split("-")[0];

        if (isSelected) {
            setSelectedOptions([...selectedOptions, option]);
            const found = allSuggestions.find((o) => o.toLowerCase() === optionValue.toLowerCase());
            if (found) {
                queryDispatch({ type: SET_SEARCH_STRING, value: optionValue, fields: "occupation" });
                return;
            }

            const optionToAdd = filterAction[optionCategory].true;
            queryDispatch({ type: optionToAdd, value: optionValue });
        } else {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));

            const optionToRemove = filterAction[optionCategory].false;
            handleFilterRemoval(optionToRemove, optionValue);
        }
    };

    const onToggleSelected = (option, isSelected, isCustomOption) => {
        if (isCustomOption || query.q.includes(option)) {
            handleFreeTextSearchOption(option, isSelected);
        } else {
            handleFilterOption(option, isSelected);
        }
    };

    // TODO: add clearButton && clearButtonLabel="Fjern alle"
    return (
        <>
            {/* {console.log(withSortedSecondLevelOccupations)} */}
            <Combobox
                allowNewValues
                label="Legg til sted, yrker og andre søkeord"
                isMultiSelect
                onToggleSelected={onToggleSelected}
                selectedOptions={selectedOptions}
                options={value && value.length > 0 ? options : []}
                onChange={onChange}
                value={value}
            />
        </>
    );
}

ComboBox.propTypes = {
    query: PropTypes.shape({
        q: PropTypes.string,
        municipals: PropTypes.arrayOf(PropTypes.string),
        counties: PropTypes.arrayOf(PropTypes.string),
        countries: PropTypes.arrayOf(PropTypes.string),
        international: PropTypes.bool,
        occupationFirstLevels: PropTypes.arrayOf(PropTypes.string),
        occupationSecondLevels: PropTypes.arrayOf(PropTypes.string),
        published: PropTypes.string,
        sector: PropTypes.arrayOf(PropTypes.string),
        engagementType: PropTypes.arrayOf(PropTypes.string),
        extent: PropTypes.arrayOf(PropTypes.string),
        education: PropTypes.arrayOf(PropTypes.string),
        workLanguage: PropTypes.arrayOf(PropTypes.string),
        remote: PropTypes.arrayOf(PropTypes.string),
    }),
    queryDispatch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    allSuggestions: PropTypes.arrayOf(PropTypes.string),
    options: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ComboBox;
