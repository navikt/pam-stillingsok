import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import { buildSelectedOptions } from "@/app/(sok)/_components/searchBox/buildSelectedOptions";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import {
    COUNTRY,
    COUNTY,
    INTERNATIONAL,
    MUNICIPAL,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    PUBLISHED,
    SEARCH_STRING,
} from "@/app/(sok)/_components/searchParamNames";
import { findLabelForFilter, getSearchBoxOptions } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";
import logAmplitudeEvent, { logFilterChanged } from "@/app/_common/monitoring/amplitude";

function SearchCombobox({ aggregations, locations }) {
    const [showComboboxList, setShowComboboxList] = useState(undefined);
    const searchQuery = useSearchQuery();

    const options = useMemo(() => getSearchBoxOptions(aggregations, locations), [aggregations, locations]);

    const selectedOptions = useMemo(
        () => buildSelectedOptions(searchQuery.urlSearchParams),
        [searchQuery.urlSearchParams],
    );

    // Hide combobox list suggesetions when an option is selected
    useEffect(() => {
        if (selectedOptions.length > 0) {
            setShowComboboxList(false);
        } else {
            setShowComboboxList(undefined);
        }
    }, [selectedOptions]);

    const optionList = options.map((o) => {
        const filterLabel = findLabelForFilter(o.value.split("-")[0]);
        return filterLabel
            ? { label: `${o.label} ${filterLabel}`, value: o.value }
            : { label: o.label, value: o.value };
    });

    const handleFreeTextSearchOption = (value, isSelected) => {
        if (isSelected) {
            searchQuery.append(SEARCH_STRING, value);
            logAmplitudeEvent("Text searched", { searchTerm: "Add" });
        } else {
            searchQuery.remove(SEARCH_STRING, value);
            logAmplitudeEvent("Text searched", { searchTerm: "Remove" });
        }
    };

    const handleFilterRemoval = (key, value) => {
        if (key === INTERNATIONAL) {
            searchQuery.remove(key);
        } else if (key === MUNICIPAL) {
            searchQuery.remove(MUNICIPAL, value);

            // Hvis dette var den siste valgte kommune i samme fylke, så skal fylket også fjernes
            const county = value.split(".")[0];
            const remainingMunicipalsInCounty = searchQuery
                .getAll(MUNICIPAL)
                .filter((municipal) => municipal.startsWith(`${county}.`));
            if (remainingMunicipalsInCounty && remainingMunicipalsInCounty.length === 1) {
                searchQuery.remove(COUNTY, county);
            }
        } else if (key === COUNTRY) {
            searchQuery.remove(COUNTRY, value);
            // Hvis dette var den siste landet, så skal "Utland" også fjernes
            if (searchQuery.getAll(COUNTRY).length === 1) {
                searchQuery.remove(INTERNATIONAL);
            }
        } else if (key === OCCUPATION_SECOND_LEVEL) {
            searchQuery.remove(OCCUPATION_SECOND_LEVEL, value);

            // Hvis dette var det siste yrket i samme yrkeskategori, så skal yrkeskategorien også fjernes
            const firstLevel = value.split(".")[0];
            const remainingOccupationsInCategory = searchQuery
                .getAll(OCCUPATION_SECOND_LEVEL)
                ?.filter((secondLevel) => secondLevel.startsWith(`${firstLevel}.`));
            if (remainingOccupationsInCategory && remainingOccupationsInCategory.length === 1) {
                searchQuery.remove(OCCUPATION_FIRST_LEVEL, firstLevel);
            }
        } else {
            searchQuery.remove(key, value);
        }

        logFilterChanged({ name: key, value, checked: false, source: "Søkefelt" });
    };

    function handleFilterAddition(key, value) {
        if (key === PUBLISHED) {
            searchQuery.set(key, value);
        } else if (key === MUNICIPAL) {
            searchQuery.append(MUNICIPAL, value);

            // Hvis fylket ikke allerede er valgt, så legg til dette også
            const county = value.split(".")[0];
            if (!searchQuery.has(COUNTY, county)) {
                searchQuery.append(COUNTY, county);
            }
        } else if (key === COUNTRY) {
            searchQuery.append(COUNTRY, value);
            searchQuery.set(INTERNATIONAL, "true");
        } else if (key === OCCUPATION_SECOND_LEVEL) {
            searchQuery.append(OCCUPATION_SECOND_LEVEL, value);

            // Hvis yrkeskategorien ikke allerede er valgt, så legg til denne også
            const firstLevel = value.split(".")[0];
            if (!searchQuery.has(OCCUPATION_FIRST_LEVEL, firstLevel)) {
                searchQuery.append(OCCUPATION_FIRST_LEVEL, firstLevel);
            }
        } else {
            searchQuery.append(key, value);
        }
        logFilterChanged({ name: key, value, checked: true, source: "Søkefelt" });
    }

    const handleFilterOption = (option, isSelected) => {
        const value = option.slice(option.indexOf("-") + 1);
        const fragements = option.split("-");
        const key = fragements.length > 1 ? fragements[0] : undefined;

        if (isSelected) {
            handleFilterAddition(key, value);
        } else if (key) {
            handleFilterRemoval(key, value);
        } else {
            handleFreeTextSearchOption(value, false);
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
            onChange={(val) => {
                // Only show combobox list suggestion when user has started typing
                if (val.length > 0) {
                    setShowComboboxList(undefined);
                } else if (selectedOptions.length > 0) {
                    setShowComboboxList(false);
                }
            }}
            enterKeyHint="done"
            shouldAutocomplete
            allowNewValues
            isListOpen={showComboboxList}
            label="Legg til sted, yrker og andre søkeord"
            isMultiSelect
            onToggleSelected={onToggleSelected}
            selectedOptions={selectedOptions}
            options={optionList}
        />
    );
}

export default SearchCombobox;
