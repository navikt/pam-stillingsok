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
import { editedItemKey } from "@/app/(sok)/_components/filters/Engagement";
import { FilterEnum } from "@/app/(sok)/_components/searchBox/FilterEnum";

function ComboBox({ query, queryDispatch }) {
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

    const typeOfFilter = (option) => {
        switch (option.split("-")[0]) {
            case FilterEnum.MUNICIPALS:
                return REMOVE_MUNICIPAL;
            case FilterEnum.COUNTIES:
                return REMOVE_COUNTY;
            case FilterEnum.INTERNATIONAL:
                return SET_INTERNATIONAL;
            case FilterEnum.COUNTRIES:
                return REMOVE_COUNTRY;
            case FilterEnum.OCCUPATION_FIRST_LEVELS:
                return REMOVE_OCCUPATION_FIRST_LEVEL;
            case FilterEnum.OCCUPATION_SECOND_LEVELS:
                return REMOVE_OCCUPATION_SECOND_LEVEL;
            case FilterEnum.PUBLISHED:
                return SET_PUBLISHED;
            case FilterEnum.ENGAGEMENT_TYPE:
                return REMOVE_ENGAGEMENT_TYPE;
            case FilterEnum.EXTENT:
                return REMOVE_EXTENT;
            case FilterEnum.WORK_LANGUAGE:
                return REMOVE_WORKLANGUAGE;
            case FilterEnum.EDUCATION:
                return REMOVE_EDUCATION;
            case FilterEnum.REMOTE:
                return REMOVE_REMOTE;
            case FilterEnum.SECTOR:
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
