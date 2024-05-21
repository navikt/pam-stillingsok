import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "@/app/(sok)/_utils/queryReducer";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";

function ComboBox({ query, dispatch }) {
    const [value, setValue] = useState("");
    const mockPersistUserAddedValues = (option, isSelected) => {
        console.log("custom option", { option, isSelected });
    };
    // TODO handle t1 t1, aka double of same value, gives error
    function getQueryOptions(queryObject) {
        const searchTerm = queryObject.q && queryObject.q.trim();
        const searchTerms = searchTerm ? searchTerm.split(" ").map((val) => ({ label: val, value: `q-${val}` })) : [];
        return [
            ...searchTerms,
            ...queryObject.municipals.map((municipals) => fixLocationName(municipals.split(".")[1])),
            ...queryObject.counties.map((counties) => fixLocationName(counties)),
            ...queryObject.countries.map((countries) => fixLocationName(countries)),
            ...queryObject.occupationSecondLevels.map((occupation) => occupation.split(".")[1]),
            ...(queryObject.published ? [PublishedLabelsEnum[queryObject.published]] : []),
            ...queryObject.occupationFirstLevels,
            ...queryObject.extent,
            ...queryObject.engagementType,
            ...queryObject.sector,
            ...queryObject.education,
            ...queryObject.workLanguage,
            ...queryObject.remote,
        ];
    }

    const initialSelectedOptions = useMemo(() => getQueryOptions(query), [query]);

    const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);

    useEffect(() => {
        const newInitialSelectedOptions = getQueryOptions(query);
        setSelectedOptions(newInitialSelectedOptions);
    }, [query]);

    const initialOptions = useMemo(
        () => [
            { label: "Hjelpemidler", value: "HJE" },
            { label: "Oppfølging", value: "OPP" },
            { label: "Sykepenger", value: "SYK" },
            { label: "Sykemelding", value: "SYM" },
            { label: "Foreldre- og svangerskapspenger", value: "FOR" },
            { label: "Arbeidsavklaringspenger", value: "AAP" },
            { label: "Uføretrygd", value: "UFO" },
            { label: "Pensjon", value: "PEN" },
            { label: "Barnetrygd", value: "BAR" },
            { label: "Kontantstøtte", value: "KON" },
            { label: "Bostøtte", value: "BOS" },
            { label: "Barnebidrag", value: "BBI" },
            { label: "Bidragsforskudd", value: "BIF" },
            { label: "Grunn- og hjelpestønad", value: "GRU" },
        ],
        [],
    );

    const filteredOptions = useMemo(
        () => initialOptions.filter((option) => option && option.value.includes(value)),
        [value, initialOptions],
    );

    // TODO: add "job" search term
    // TODO: add toggle functions for query [] and filters[]
    const onToggleSelected = (option, isSelected, isCustomOption) => {
        if (isSelected) {
            // setSelectedOptions([...selectedOptions, { label: option, value: `q-${option}` }]);
            if (option) {
                dispatch({
                    type: SET_SEARCH_STRING,
                    value: [...selectedOptions.map((opt) => opt.label), option].join(" "),
                });
            }
        } else if (option) {
            const selected = selectedOptions.filter((o) => o.value !== option);
            // setSelectedOptions(selected);
            dispatch({ type: SET_SEARCH_STRING, value: selected.map((val) => val.label).join(" ") });
        }
        if (isCustomOption) {
            mockPersistUserAddedValues(option, isSelected);
        }
    };

    // TODO: add clearButton && clearButtonLabel="Fjern alle"
    return (
        <>
            {/* {console.log(getQueryQ(query))} */}
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
    // q: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default ComboBox;
