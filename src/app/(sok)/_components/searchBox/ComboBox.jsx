import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "@/app/(sok)/_utils/queryReducer";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";

function ComboBox({ query, dispatch }) {
    function getQueryOptions(queryObject) {
        const searchTerm = queryObject.q && queryObject.q.trim();
        const searchTerms = searchTerm ? searchTerm.split(" ") : [];
        return [
            ...searchTerms,
            ...queryObject.municipals.map((municipals) => ({
                label: fixLocationName(municipals.split(".")[1]),
                value: `municipals-${municipals}`,
            })),
            ...queryObject.counties.map((counties) => ({
                label: fixLocationName(counties),
                value: `counties-${counties}`,
            })),
            ...queryObject.countries.map((countries) => ({
                label: fixLocationName(countries),
                value: `counties-${countries}`,
            })),
            ...queryObject.occupationSecondLevels.map((occupation) => ({
                label: occupation.split(".")[1],
                value: `occupationSecondLevels-${occupation}`,
            })),
            ...(queryObject.published
                ? [{ label: PublishedLabelsEnum[queryObject.published], value: `published-${queryObject.published}` }]
                : []),
            ...queryObject.occupationFirstLevels.map((occupation) => ({
                label: occupation,
                value: `occupationFirstLevels-${occupation}`,
            })),
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

    const onToggleSelected = (option, isSelected, isCustomOption) => {
        if (isSelected) {
            setSelectedOptions([...selectedOptions, option]);
        } else {
            setSelectedOptions(selectedOptions.filter((o) => o !== option));
        }
        if (isCustomOption) {
            if (isSelected) {
                dispatch({
                    type: SET_SEARCH_STRING,
                    value: [...selectedOptions.filter((opt) => !opt.value), option].join(" "),
                });
            } else {
                const selected = selectedOptions.filter((o) => o !== option);
                dispatch({ type: SET_SEARCH_STRING, value: selected.filter((opt) => !opt.value).join(" ") });
            }
        }
    };
    // TODO: add clearButton && clearButtonLabel="Fjern alle"
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
    dispatch: PropTypes.func.isRequired,
};

export default ComboBox;
