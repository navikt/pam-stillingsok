"use client";

import { UNSAFE_Combobox as Combobox, Show } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import { buildSelectedOptions } from "@/app/(sok)/_components/searchBox/buildSelectedOptions";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import { findLabelForFilter, getSearchBoxOptions } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";
import logAmplitudeEvent, { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { ComboboxExternalItems } from "@navikt/arbeidsplassen-react";
import FilterAggregations from "@/app/(sok)/_types/FilterAggregations";
import { SearchLocation } from "@/app/(sok)/page";
import { FilterSource } from "@/app/_common/monitoring/amplitudeHelpers";
import ScreenReaderText from "./ScreenReaderText";

interface SearchComboboxProps {
    aggregations: FilterAggregations;
    locations: SearchLocation[];
}
function SearchCombobox({ aggregations, locations }: SearchComboboxProps) {
    const [showComboboxList, setShowComboboxList] = useState<boolean | undefined>(undefined);
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const query = useQuery();

    const options = useMemo(() => getSearchBoxOptions(aggregations, locations), [aggregations, locations]);

    const selectedOptions = useMemo(() => buildSelectedOptions(query.urlSearchParams), [query.urlSearchParams]);

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Hide combobox list suggestions when an option is selected, and update text for screen readers
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

    const handleFreeTextSearchOption = (value: string, isSelected: boolean) => {
        if (isSelected) {
            query.append(QueryNames.SEARCH_STRING, value);
            logAmplitudeEvent("Text searched", { searchTerm: "Add" });
        } else {
            query.remove(QueryNames.SEARCH_STRING, value);
            logAmplitudeEvent("Text searched", { searchTerm: "Remove" });
        }
    };

    const handleFilterRemoval = (key: string, value: string) => {
        if (key === QueryNames.INTERNATIONAL) {
            query.remove(key);
        } else if (key === QueryNames.MUNICIPAL) {
            query.remove(QueryNames.MUNICIPAL, value);

            // Hvis dette var den siste valgte kommune i samme fylke, så skal fylket også fjernes
            const county = value.split(".")[0];
            const remainingMunicipalsInCounty = query
                .getAll(QueryNames.MUNICIPAL)
                .filter((municipal) => municipal.startsWith(`${county}.`));
            if (remainingMunicipalsInCounty && remainingMunicipalsInCounty.length === 1) {
                query.remove(QueryNames.COUNTY, county);
            }
        } else if (key === QueryNames.COUNTRY) {
            query.remove(QueryNames.COUNTRY, value);
            // Hvis dette var den siste landet, så skal "Utland" også fjernes
            if (query.getAll(QueryNames.COUNTRY).length === 1) {
                query.remove(QueryNames.INTERNATIONAL);
            }
        } else if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
            query.remove(QueryNames.OCCUPATION_SECOND_LEVEL, value);

            // Hvis dette var det siste yrket i samme yrkeskategori, så skal yrkeskategorien også fjernes
            const firstLevel = value.split(".")[0];
            const remainingOccupationsInCategory = query
                .getAll(QueryNames.OCCUPATION_SECOND_LEVEL)
                ?.filter((secondLevel) => secondLevel.startsWith(`${firstLevel}.`));
            if (remainingOccupationsInCategory && remainingOccupationsInCategory.length === 1) {
                query.remove(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel);
            }
        } else {
            query.remove(key, value);
        }

        logFilterChanged({ name: key, value, checked: false, source: FilterSource.SEARCHBOX });
    };

    function handleFilterAddition(key: string | undefined, value: string) {
        if (key === QueryNames.PUBLISHED) {
            query.set(key, value);
        } else if (key === QueryNames.MUNICIPAL) {
            query.append(QueryNames.MUNICIPAL, value);

            // Hvis fylket ikke allerede er valgt, så legg til dette også
            const county = value.split(".")[0];
            if (!query.has(QueryNames.COUNTY, county)) {
                query.append(QueryNames.COUNTY, county);
            }
        } else if (key === QueryNames.COUNTRY) {
            query.append(QueryNames.COUNTRY, value);
            query.set(QueryNames.INTERNATIONAL, "true");
        } else if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
            query.append(QueryNames.OCCUPATION_SECOND_LEVEL, value);

            // Hvis yrkeskategorien ikke allerede er valgt, så legg til denne også
            const firstLevel = value.split(".")[0];
            if (!query.has(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel)) {
                query.append(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel);
            }
        } else {
            query.append(key || "", value);
        }
        logFilterChanged({ name: key || "", value, checked: true, source: FilterSource.SEARCHBOX });
    }

    const handleFilterOption = (option: string, isSelected: boolean) => {
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

    const onToggleSelected = (option: string, isSelected: boolean, isCustomOption: boolean) => {
        if (isCustomOption) {
            handleFreeTextSearchOption(option, isSelected);
        } else {
            handleFilterOption(option, isSelected);
        }
    };

    return (
        <>
            <Combobox
                onChange={(val) => {
                    // Only show combobox list suggestion when user has started typing
                    if (val.length > 0) {
                        setShowComboboxList(undefined);
                    } else if (selectedOptions.length > 0) {
                        setShowComboboxList(false);
                    }
                }}
                clearButton={false}
                enterKeyHint="done"
                shouldAutocomplete
                allowNewValues
                isListOpen={showComboboxList}
                label="Legg til sted, yrker og andre søkeord"
                isMultiSelect
                onToggleSelected={onToggleSelected}
                selectedOptions={selectedOptions}
                // Hide selected options in combobox below sm breakpoint
                shouldShowSelectedOptions={!(windowWidth < 480)}
                options={optionList}
            />
            <Show below="sm">
                <ComboboxExternalItems
                    fontWeight="semibold"
                    itemsLeadingText="Søket ditt"
                    items={selectedOptions}
                    removeComboboxItem={(val: { label: string; value: string }) => {
                        handleFilterOption(val.value, false);
                    }}
                />
            </Show>
            <ScreenReaderText selectedOptions={selectedOptions} />
        </>
    );
}

export default SearchCombobox;
