"use client";

import { UNSAFE_Combobox as Combobox, Show } from "@navikt/ds-react";
import React, { useEffect, useMemo, useState } from "react";
import { buildSelectedOptions } from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import {
    findLabelForFilter,
    getSearchBoxOptions,
} from "@/app/stillinger/(sok)/_components/searchBox/buildSearchBoxOptions";
import { ComboboxExternalItems } from "@navikt/arbeidsplassen-react";
import FilterAggregations from "@/app/stillinger/_common/types/FilterAggregations";
import { SearchLocation } from "@/app/stillinger/(sok)/page";
import ScreenReaderText from "./ScreenReaderText";
import { containsEmail, containsValidFnrOrDnr } from "@/app/stillinger/_common/utils/utils";
import { ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";

interface SearchComboboxProps {
    aggregations: FilterAggregations;
    locations: SearchLocation[];
}
function SearchCombobox({ aggregations, locations }: SearchComboboxProps) {
    const [showComboboxList, setShowComboboxList] = useState<boolean | undefined>(undefined);
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [optionList, setOptionList] = useState<ComboboxOption[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<ComboboxOption[]>([]);
    const query = useQuery();

    const options = useMemo(() => getSearchBoxOptions(aggregations, locations), [aggregations, locations]);

    const selectedOptions = useMemo(() => buildSelectedOptions(query.urlSearchParams), [query.urlSearchParams]);

    const isValidFreeText = (val: string): boolean => {
        if (containsValidFnrOrDnr(val) || containsEmail(val)) {
            setErrorMessage(
                "Teksten du har skrevet inn kan inneholde personopplysninger. Dette er ikke tillatt av personvernhensyn. Hvis du mener dette er feil, kontakt oss på nav.team.arbeidsplassen@nav.no",
            );
            return false;
        } else if (val.length > 100) {
            setErrorMessage("Søkeord kan ikke ha mer enn 100 tegn");
            return false;
        }
        return true;
    };

    useEffect(() => {
        const initialOptions = [
            ...options.map((o) => {
                const filterLabel = findLabelForFilter(o.value.split("-")[0]);
                return filterLabel
                    ? { label: `${o.label} ${filterLabel}`, value: o.value }
                    : { label: o.label, value: o.value };
            }),
        ];
        setOptionList(initialOptions);
        setFilteredOptions(initialOptions);

        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Hide combobox list suggestions when an option is selected
    useEffect(() => {
        if (selectedOptions.length > 0) {
            setShowComboboxList(false);
        } else {
            setShowComboboxList(undefined);
        }
    }, [selectedOptions]);

    const handleFreeTextSearchOption = (value: string, isSelected: boolean) => {
        if (isSelected) {
            query.append(QueryNames.SEARCH_STRING, value);
            setOptionList([...optionList, { label: value, value: value }]);
        } else {
            query.remove(QueryNames.SEARCH_STRING, value);
            setOptionList(optionList.filter((option) => option.value !== value));
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
        setErrorMessage(null);
        if (isCustomOption) {
            if (isValidFreeText(option)) {
                handleFreeTextSearchOption(option, isSelected);
            } else {
                setShowComboboxList(false);
            }
        } else {
            handleFilterOption(option, isSelected);
        }
    };

    return (
        <>
            <Combobox
                filteredOptions={filteredOptions}
                onChange={(val) => {
                    setFilteredOptions(
                        optionList.filter((option) => option.label.toLowerCase().includes(val.toLowerCase())),
                    );
                    // Only show combobox list suggestion when user has started typing
                    if (val.length > 0 && val.length < 100) {
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
                error={errorMessage}
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
