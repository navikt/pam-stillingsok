import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
    REMOVE_COUNTRY,
    REMOVE_COUNTY,
    REMOVE_EDUCATION,
    REMOVE_ENGAGEMENT_TYPE,
    REMOVE_EXTENT,
    REMOVE_MUNICIPAL,
    REMOVE_OCCUPATION_FIRST_LEVEL,
    REMOVE_OCCUPATION_SECOND_LEVEL,
    REMOVE_REMOTE,
    REMOVE_SECTOR,
    REMOVE_WORKLANGUAGE,
    SET_INTERNATIONAL,
    SET_PUBLISHED,
    SET_SEARCH_STRING,
} from "@/app/(sok)/_utils/queryReducer";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import {
    filterCounties,
    filterOccupationFirstLevels,
    removeCountry,
    removeMunicipal,
    removeOccupationSecondLevel,
} from "@/app/(sok)/_components/utils/selectedFiltersUtils";

function ComboBox({ query, queryDispatch }) {
    // TODO: extract ie. "counties-"
    function getQueryOptions(queryObject) {
        const searchTerm = queryObject.q && queryObject.q.trim();
        const searchTerms = searchTerm ? searchTerm.split(" ") : [];
        return [
            ...searchTerms,
            ...queryObject.municipals.map((municipals) => ({
                label: fixLocationName(municipals.split(".")[1]),
                value: `municipals-${municipals}`,
            })),
            ...filterCounties(queryObject).map((c) => ({
                label: fixLocationName(c),
                value: `counties-${c}`,
            })),
            ...(queryObject.international && queryObject.countries.length === 0
                ? [{ label: "Utland", value: "international-utland" }]
                : []),
            ...queryObject.countries.map((countries) => ({
                label: fixLocationName(countries),
                value: `countries-${countries}`,
            })),
            ...queryObject.occupationSecondLevels.map((occupation) => ({
                label: occupation.split(".")[1],
                value: `occupationSecondLevels-${occupation}`,
            })),
            ...filterOccupationFirstLevels(queryObject).map((occupation) => ({
                label: occupation,
                value: `occupationFirstLevels-${occupation}`,
            })),
            ...(queryObject.published
                ? [{ label: PublishedLabelsEnum[queryObject.published], value: `published-${queryObject.published}` }]
                : []),
            ...queryObject.extent.map((item) => ({ label: item, value: `extent-${item}` })),
            ...queryObject.engagementType.map((item) => ({ label: item, value: `engagementType-${item}` })),
            ...queryObject.sector.map((item) => ({ label: item, value: `sector-${item}` })),
            ...queryObject.education.map((item) => ({ label: item, value: `education-${item}` })),
            ...queryObject.workLanguage.map((item) => ({ label: item, value: `workLanguage-${item}` })),
            ...queryObject.remote.map((item) => ({ label: item, value: `remote-${item}` })),
        ];
    }

    const initialSelectedOptions = useMemo(() => getQueryOptions(query), [query]);

    const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);

    useEffect(() => {
        const newInitialSelectedOptions = getQueryOptions(query);
        setSelectedOptions(newInitialSelectedOptions);
    }, [query]);

    const typeOfFilter = (option) => {
        switch (option.split("-")[0]) {
            case "municipals":
                return REMOVE_MUNICIPAL;
            case "counties":
                return REMOVE_COUNTY;
            case "international":
                return SET_INTERNATIONAL;
            case "countries":
                return REMOVE_COUNTRY;
            case "occupationFirstLevels":
                return REMOVE_OCCUPATION_FIRST_LEVEL;
            case "occupationSecondLevels":
                return REMOVE_OCCUPATION_SECOND_LEVEL;
            case "published":
                return SET_PUBLISHED;
            case "engagementType":
                return REMOVE_ENGAGEMENT_TYPE;
            case "extent":
                return REMOVE_EXTENT;
            case "workLanguage":
                return REMOVE_WORKLANGUAGE;
            case "education":
                return REMOVE_EDUCATION;
            case "remote":
                return REMOVE_REMOTE;
            case "sector":
                return REMOVE_SECTOR;
            default:
                return "";
        }
    };

    const onToggleSelected = (option, isSelected, isCustomOption) => {
        if (isSelected) {
            setSelectedOptions([...selectedOptions, option]);
        } else {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));

            const filterToRemove = typeOfFilter(option);
            const optionValue = option.slice(option.indexOf("-") + 1);
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
        }
        if (isCustomOption) {
            if (isSelected) {
                queryDispatch({
                    type: SET_SEARCH_STRING,
                    value: [...selectedOptions.filter((opt) => !opt.value), option].join(" "),
                });
            } else {
                const selected = selectedOptions.filter((o) => o !== option);
                queryDispatch({ type: SET_SEARCH_STRING, value: selected.filter((opt) => !opt.value).join(" ") });
            }
        }
    };
    // TODO: add clearButton && clearButtonLabel="Fjern alle"
    // TODO: yrkes fritekst
    return (
        <Combobox
            allowNewValues
            label="Ko-ko-kombobox"
            isMultiSelect
            onToggleSelected={onToggleSelected}
            selectedOptions={selectedOptions}
            options={[]}
        />
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
};

export default ComboBox;
