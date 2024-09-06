import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useMemo, useState } from "react";
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
    ADD_SEARCH_STRING,
    REMOVE_SEARCH_STRING,
} from "@/app/(sok)/_utils/queryReducer";
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
import { buildSelectedOptions } from "@/app/(sok)/_components/searchBox/buildSelectedOptions";

function SearchCombobox({ query, queryDispatch, onChange, options }) {
    const selectedOptions = useMemo(() => buildSelectedOptions(query), [query]);
    const [isOpen, setIsOpen] = useState(false);

    const optionList = options.map((o) => ({
        label: `${o.label} ${findLabelForFilter(o.value.split("-")[0])}`,
        value: o.value,
    }));

    const handleFreeTextSearchOption = (option, isSelected) => {
        if (isSelected) {
            queryDispatch({
                type: ADD_SEARCH_STRING,
                value: option,
            });
        } else {
            queryDispatch({ type: REMOVE_SEARCH_STRING, value: option });
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

        if (isSelected) {
            const filter = option.split("-")[0];
            const optionToAdd = getFilter[filter].add;
            handleFilterAddition(optionToAdd, optionValue);
        } else {
            const fragements = option.split("-");
            const optionToRemove = fragements.length === 2 ? getFilter[fragements[0]].remove : undefined;
            if (optionToRemove) {
                handleFilterRemoval(optionToRemove, optionValue);
            } else {
                handleFreeTextSearchOption(optionValue, false);
            }
        }
    };

    const onToggleSelected = (option, isSelected, isCustomOption) => {
        if (isCustomOption) {
            handleFreeTextSearchOption(option, isSelected);
        } else {
            handleFilterOption(option, isSelected);
        }
    };

    return (
        <Combobox
            isListOpen={isOpen}
            allowNewValues
            label="Legg til sted, yrker og andre søkeord"
            isMultiSelect
            onToggleSelected={onToggleSelected}
            selectedOptions={selectedOptions}
            options={optionList}
            onChange={(value) => {
                setIsOpen(value.length > 0);
                onChange(value);
            }}
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
