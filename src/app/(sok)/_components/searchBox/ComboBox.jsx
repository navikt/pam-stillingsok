import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
    ADD_COUNTRY,
    ADD_COUNTY,
    ADD_EDUCATION,
    ADD_ENGAGEMENT_TYPE,
    ADD_EXTENT,
    ADD_MUNICIPAL,
    ADD_OCCUPATION_FIRST_LEVEL,
    ADD_OCCUPATION_SECOND_LEVEL,
    ADD_REMOTE,
    ADD_SECTOR,
    ADD_WORKLANGUAGE,
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
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { FilterEnum } from "@/app/(sok)/_components/searchBox/FilterEnum";
import buildLocations from "@/app/(sok)/_components/utils/buildLocations";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";

function ComboBox({ query, queryDispatch, onChange, value, allSuggestions, aggregations, locations }) {
    function getQueryOptions(queryObject) {
        const searchTerm = queryObject.q && queryObject.q.trim();
        const searchTerms = searchTerm ? searchTerm.split(" ") : [];
        return [
            ...searchTerms,
            ...queryObject.municipals.map((municipals) => ({
                label: fixLocationName(municipals.split(".")[1]),
                value: `${FilterEnum.MUNICIPALS}-${municipals}`,
            })),
            ...filterCounties(queryObject).map((c) => ({
                label: fixLocationName(c),
                value: `${FilterEnum.COUNTIES}-${c}`,
            })),
            ...queryObject.countries.map((countries) => ({
                label: fixLocationName(countries),
                value: `${FilterEnum.COUNTRIES}-${countries}`,
            })),
            ...(queryObject.international && queryObject.countries.length === 0
                ? [{ label: "Utland", value: `${FilterEnum.INTERNATIONAL}-utland` }]
                : []),
            ...queryObject.occupationSecondLevels.map((occupation) => ({
                label: occupation.split(".")[1],
                value: `${FilterEnum.OCCUPATION_SECOND_LEVELS}-${occupation}`,
            })),
            ...filterOccupationFirstLevels(queryObject).map((occupation) => ({
                label: occupation,
                value: `${FilterEnum.OCCUPATION_FIRST_LEVELS}-${occupation}`,
            })),
            ...(queryObject.published
                ? [
                      {
                          label: PublishedLabelsEnum[queryObject.published],
                          value: `${FilterEnum.PUBLISHED}-${queryObject.published}`,
                      },
                  ]
                : []),
            ...queryObject.sector.map((item) =>
                item === "Ikke oppgitt"
                    ? { label: "Sektor ikke oppgitt", value: `${FilterEnum.SECTOR}-${item}` }
                    : { label: item, value: `${FilterEnum.SECTOR}-${item}` },
            ),
            ...queryObject.engagementType.map((item) =>
                editedItemKey(item) === "Ikke oppgitt"
                    ? { label: "Ansettelsesform ikke oppgitt", value: `${FilterEnum.ENGAGEMENT_TYPE}-${item}` }
                    : { label: item, value: `${FilterEnum.ENGAGEMENT_TYPE}-${item}` },
            ),
            ...queryObject.extent.map((item) => ({ label: item, value: `${FilterEnum.EXTENT}-${item}` })),
            ...queryObject.education.map((item) => ({ label: item, value: `${FilterEnum.EDUCATION}-${item}` })),
            ...queryObject.workLanguage.map((item) =>
                item === "Ikke oppgitt"
                    ? { label: "Arbeidsspråk ikke oppgitt", value: `${FilterEnum.WORK_LANGUAGE}-${item}` }
                    : { label: item, value: `${FilterEnum.WORK_LANGUAGE}-${item}` },
            ),
            ...queryObject.remote.map((item) =>
                item === "Ikke oppgitt"
                    ? { label: "Hjemmekontor ikke oppgitt", value: `${FilterEnum.REMOTE}-${item}` }
                    : { label: item, value: `${FilterEnum.REMOTE}-${item}` },
            ),
        ];
    }

    const initialSelectedOptions = useMemo(() => getQueryOptions(query), [query]);

    const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);

    useEffect(() => {
        const newInitialSelectedOptions = getQueryOptions(query);
        setSelectedOptions(newInitialSelectedOptions);
    }, [query]);

    const filterActions = {
        [FilterEnum.MUNICIPALS]: { true: ADD_MUNICIPAL, false: REMOVE_MUNICIPAL },
        [FilterEnum.COUNTIES]: { true: ADD_COUNTY, false: REMOVE_COUNTY },
        [FilterEnum.INTERNATIONAL]: { true: SET_INTERNATIONAL, false: SET_INTERNATIONAL },
        [FilterEnum.COUNTRIES]: { true: ADD_COUNTRY, false: REMOVE_COUNTRY },
        [FilterEnum.OCCUPATION_FIRST_LEVELS]: {
            true: ADD_OCCUPATION_FIRST_LEVEL,
            false: REMOVE_OCCUPATION_FIRST_LEVEL,
        },
        [FilterEnum.OCCUPATION_SECOND_LEVELS]: {
            true: ADD_OCCUPATION_SECOND_LEVEL,
            false: REMOVE_OCCUPATION_SECOND_LEVEL,
        },
        [FilterEnum.PUBLISHED]: { true: SET_PUBLISHED, false: SET_PUBLISHED },
        [FilterEnum.ENGAGEMENT_TYPE]: { true: ADD_ENGAGEMENT_TYPE, false: REMOVE_ENGAGEMENT_TYPE },
        [FilterEnum.EXTENT]: { true: ADD_EXTENT, false: REMOVE_EXTENT },
        [FilterEnum.WORK_LANGUAGE]: { true: ADD_WORKLANGUAGE, false: REMOVE_WORKLANGUAGE },
        [FilterEnum.EDUCATION]: { true: ADD_EDUCATION, false: REMOVE_EDUCATION },
        [FilterEnum.REMOTE]: { true: ADD_REMOTE, false: REMOVE_REMOTE },
        [FilterEnum.SECTOR]: { true: ADD_SECTOR, false: REMOVE_SECTOR },
    };

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

    const handleOccupation = (option) => {
        queryDispatch({ type: SET_SEARCH_STRING, value: option, fields: "occupation" });
    };

    const typeOfFilter = (option, toAdd) => {
        const filterValue = option.split("-")[0];
        return filterActions[filterValue][toAdd];
    };

    const handleFilterOption = (option, isSelected) => {
        const optionValue = option.slice(option.indexOf("-") + 1);
        if (isSelected) {
            setSelectedOptions([...selectedOptions, option]);

            const found = allSuggestions.find((o) => o.toLowerCase() === option.toLowerCase());
            if (found) {
                handleOccupation(option);
                return;
            }

            const filterToAdd = typeOfFilter(option, true);
            queryDispatch({ type: filterToAdd, value: optionValue });
        } else {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));

            const filterToRemove = typeOfFilter(option, false);
            handleFilterRemoval(filterToRemove, optionValue);
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
    // TODO: add sidebar filters to combobox options
    // TODO: show label in selectedOptions
    // TODO: checking off municipal, doesn't mark county, same for Utland, country
    const locationList = buildLocations(aggregations, locations);

    const municipalList = locationList
        .map((location) => location.subLocations)
        .flat()
        .filter((subLocation) => subLocation.type === "municipal")
        .map((municipal) => ({
            label: fixLocationName(municipal.key.split(".")[1]),
            value: `${FilterEnum.MUNICIPALS}-${municipal.key}`,
        }));

    const countyList = locationList
        .filter((location) => location.type === "county")
        .map((county) => ({
            label: fixLocationName(county.key),
            value: `${FilterEnum.COUNTIES}-${county.key}`,
        }));

    const countryList = locationList
        .filter((location) => location.type === "international")
        .map((location) => location.subLocations)
        .flat()
        .map((country) => ({
            label: fixLocationName(country.key),
            value: `${FilterEnum.COUNTRIES}-${country.key}`,
        }));

    const withSortedSecondLevelOccupations = aggregations.occupationFirstLevels.map((item) => {
        const secondLevel = sortValuesByFirstLetter(item.occupationSecondLevels);
        return {
            secondLevel,
            ...item,
        };
    });
    const sortedByLetterFirstLevelOccupationsList = sortValuesByFirstLetter(withSortedSecondLevelOccupations).map(
        (occupation) => ({
            label: occupation.key,
            value: `${FilterEnum.OCCUPATION_FIRST_LEVELS}-${occupation.key}`,
        }),
    );
    // secondlevel occupations

    // published
    // sector
    const sectorList = aggregations.sector.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Sektor ikke oppgitt", value: `${FilterEnum.SECTOR}-${item.key}` }
            : { label: item.key, value: `${FilterEnum.SECTOR}-${item.key}` },
    );

    const engagementTypeList = aggregations.engagementTypes.map((item) =>
        editedItemKey(item.key) === "Ikke oppgitt"
            ? { label: "Ansettelsesform ikke oppgitt", value: `${FilterEnum.ENGAGEMENT_TYPE}-${item.key}` }
            : { label: item.key, value: `${FilterEnum.ENGAGEMENT_TYPE}-${item.key}` },
    );
    // extent
    // education
    // workLanguage
    const remoteList = aggregations.remote.map((item) =>
        item.key === "Ikke oppgitt"
            ? { label: "Hjemmekontor ikke oppgitt", value: `${FilterEnum.REMOTE}-${item.key}` }
            : { label: item.key, value: `${FilterEnum.REMOTE}-${item.key}` },
    );

    const optionsList = [
        ...allSuggestions,
        ...remoteList,
        ...municipalList,
        ...countyList,
        ...countryList,
        ...sortedByLetterFirstLevelOccupationsList,
        ...sectorList,
        ...engagementTypeList,
    ];

    return (
        <>
            {/* {console.log(withSortedSecondLevelOccupations)} */}
            <Combobox
                allowNewValues
                label="Legg til sted, yrker og andre søkeord"
                isMultiSelect
                onToggleSelected={onToggleSelected}
                selectedOptions={selectedOptions}
                options={value && value.length > 0 ? optionsList : []}
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
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
};

export default ComboBox;
