import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
    ADD_COUNTRY,
    ADD_MUNICIPAL,
    ADD_OCCUPATION_SECOND_LEVEL,
    REMOVE_COUNTRY,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
    SET_SEARCH_STRING,
} from "@/app/(sok)/_utils/queryReducer";
import { getQueryOptions } from "@/app/(sok)/_components/searchBox/searchBoxOption";
import {
    addCountryFilter,
    addMunicipalFilter,
    addOccupationSecondLevelFilter,
    findLabelForFilter,
    getFilter,
    removeCountryFilter,
    removeMunicipalFilter,
    removeOccupationSecondLevelFilter,
} from "@/app/(sok)/_components/searchBox/searchBoxFilter";

function SearchCombobox({ query, queryDispatch, onChange, options }) {
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
            removeMunicipalFilter(queryDispatch, query, optionValue);
        } else if (filterToRemove === REMOVE_COUNTRY) {
            removeCountryFilter(queryDispatch, query, optionValue);
        } else if (filterToRemove === REMOVE_OCCUPATION_SECOND_LEVEL) {
            removeOccupationSecondLevelFilter(queryDispatch, query, optionValue);
        } else {
            queryDispatch({ type: filterToRemove, value: optionValue });
        }
    };

    const handleFilterAddition = (filterToAdd, optionValue) => {
        if (filterToAdd === ADD_MUNICIPAL) {
            addMunicipalFilter(queryDispatch, query, optionValue);
        } else if (filterToAdd === ADD_COUNTRY) {
            addCountryFilter(queryDispatch, optionValue);
        } else if (filterToAdd === ADD_OCCUPATION_SECOND_LEVEL) {
            addOccupationSecondLevelFilter(queryDispatch, query, optionValue);
        } else {
            queryDispatch({ type: filterToAdd, value: optionValue });
        }
    };

    const handleFilterOption = (option, isSelected) => {
        const optionValue = option.slice(option.indexOf("-") + 1);
        const filter = option.split("-")[0];

        if (isSelected) {
            setSelectedOptions([...selectedOptions, option]);

            const optionToAdd = getFilter[filter].add;
            handleFilterAddition(optionToAdd, optionValue);
        } else {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));

            const optionToRemove = getFilter[filter].remove;
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

    const optionLi = options.map((o) => ({
        label: `${o.label} ${findLabelForFilter(o.value.split("-")[0])}`,
        value: o.value,
    }));

    return (
        <Combobox
            allowNewValues
            label="Legg til sted, yrker og andre søkeord"
            isMultiSelect
            onToggleSelected={onToggleSelected}
            selectedOptions={selectedOptions}
            options={optionLi}
            onChange={onChange}
        />
    );
}

SearchCombobox.propTypes = {
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
    options: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SearchCombobox;
