"use client";

import { UNSAFE_Combobox as Combobox, Show } from "@navikt/ds-react";
import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { buildSelectedOptions } from "@/app/stillinger/(sok)/_components/searchBox/buildSelectedOptions";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { ComboboxExternalItems, ComboboxItem } from "@navikt/arbeidsplassen-react";
import ScreenReaderText from "./ScreenReaderText";
import { containsEmail, containsValidFnrOrDnr } from "@/app/stillinger/_common/utils/utils";
import { type ComboboxOption } from "@navikt/ds-react/esm/form/combobox/types";
import { type SearchComboboxOption } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";

type SearchComboboxProps = Readonly<{
    options: readonly SearchComboboxOption[];
}>;

function toComboboxOption(option: SearchComboboxOption): ComboboxOption {
    return {
        label: option.label,
        value: option.value,
    };
}

function mergeOptions(
    baseOptions: readonly ComboboxOption[],
    customOptions: readonly ComboboxOption[],
    selectedOptions: readonly ComboboxOption[],
): ComboboxOption[] {
    const knownValues = new Set<string>();

    const mergedOptions: ComboboxOption[] = [];

    const pushIfMissing = (option: ComboboxOption) => {
        if (!knownValues.has(option.value)) {
            knownValues.add(option.value);
            mergedOptions.push(option);
        }
    };

    baseOptions.forEach((option) => {
        pushIfMissing(option);
    });

    customOptions.forEach((option) => {
        pushIfMissing(option);
    });

    selectedOptions.forEach((option) => {
        pushIfMissing(option);
    });

    return mergedOptions;
}

function filterOptions(options: readonly ComboboxOption[], rawInputValue: string): ComboboxOption[] {
    const normalizedInputValue = rawInputValue.trim().toLowerCase();

    if (normalizedInputValue.length === 0) {
        return [...options];
    }

    return options.filter((option) => {
        return option.label.toLowerCase().includes(normalizedInputValue);
    });
}

function useShouldShowSelectedOptions(): boolean {
    const [shouldShowSelectedOptions, setShouldShowSelectedOptions] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const mediaQueryList = window.matchMedia("(max-width: 479px)");

        const updateSelectedOptionsVisibility = (matches: boolean) => {
            setShouldShowSelectedOptions(!matches);
        };

        updateSelectedOptionsVisibility(mediaQueryList.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            updateSelectedOptionsVisibility(event.matches);
        };

        if (typeof mediaQueryList.addEventListener === "function") {
            mediaQueryList.addEventListener("change", handleChange);

            return () => {
                mediaQueryList.removeEventListener("change", handleChange);
            };
        }

        mediaQueryList.addListener(handleChange);

        return () => {
            mediaQueryList.removeListener(handleChange);
        };
    }, []);

    return shouldShowSelectedOptions;
}

function isKnownQueryName(potentialKey: string): boolean {
    return (Object.values(QueryNames) as string[]).includes(potentialKey);
}

function parseOption(option: string): Readonly<{
    key?: string;
    value: string;
}> {
    const dashIndex = option.indexOf("-");
    if (dashIndex === -1) {
        return {
            value: option,
        };
    }
    const potentialKey = option.slice(0, dashIndex);
    if (isKnownQueryName(potentialKey)) {
        return {
            key: potentialKey,
            value: option.slice(dashIndex + 1),
        };
    }
    return {
        key: potentialKey,
        value: option,
    };
}

function SearchCombobox({ options }: SearchComboboxProps) {
    const [showComboboxList, setShowComboboxList] = useState<boolean | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [customOptions, setCustomOptions] = useState<readonly ComboboxOption[]>([]);

    const query = useQuery();
    const shouldShowSelectedOptions = useShouldShowSelectedOptions();
    const deferredInputValue = useDeferredValue(inputValue);
    const queryKey = query.urlSearchParams.toString();

    const baseOptions = useMemo(() => {
        return options.map((option) => {
            return toComboboxOption(option);
        });
    }, [options]);

    const selectedOptions = useMemo(() => {
        return buildSelectedOptions(query.urlSearchParams);
    }, [query.urlSearchParams, queryKey]);

    const optionList = useMemo(() => {
        return mergeOptions(baseOptions, customOptions, selectedOptions);
    }, [baseOptions, customOptions, selectedOptions]);

    const filteredOptions = useMemo(() => {
        return filterOptions(optionList, deferredInputValue);
    }, [optionList, deferredInputValue]);

    const isValidFreeText = (value: string): boolean => {
        if (containsValidFnrOrDnr(value) || containsEmail(value)) {
            setErrorMessage(
                "Teksten du har skrevet inn kan inneholde personopplysninger. Dette er ikke tillatt av personvernhensyn. Hvis du mener dette er feil, kontakt oss på nav.team.arbeidsplassen@nav.no",
            );
            return false;
        }

        if (value.length > 100) {
            setErrorMessage("Søkeord kan ikke ha mer enn 100 tegn");
            return false;
        }

        return true;
    };

    const handleFreeTextSearchOption = (value: string, isSelected: boolean) => {
        if (isSelected) {
            query.append(QueryNames.SEARCH_STRING, value);

            setCustomOptions((currentOptions) => {
                const alreadyExists = currentOptions.some((option) => {
                    return option.value === value;
                });

                if (alreadyExists) {
                    return currentOptions;
                }

                return [...currentOptions, { label: value, value }];
            });
        } else {
            query.remove(QueryNames.SEARCH_STRING, value);

            setCustomOptions((currentOptions) => {
                return currentOptions.filter((option) => {
                    return option.value !== value;
                });
            });
        }
    };

    const handleFilterRemoval = (key: string, value: string) => {
        if (key === QueryNames.INTERNATIONAL) {
            query.remove(key);
        } else if (key === QueryNames.MUNICIPAL) {
            query.remove(QueryNames.MUNICIPAL, value);

            const county = value.split(".")[0];
            const remainingMunicipalsInCounty = query.getAll(QueryNames.MUNICIPAL).filter((municipal) => {
                return municipal.startsWith(`${county}.`);
            });

            if (remainingMunicipalsInCounty.length === 1) {
                query.remove(QueryNames.COUNTY, county);
            }
        } else if (key === QueryNames.COUNTRY) {
            query.remove(QueryNames.COUNTRY, value);

            if (query.getAll(QueryNames.COUNTRY).length === 1) {
                query.remove(QueryNames.INTERNATIONAL);
            }
        } else if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
            query.remove(QueryNames.OCCUPATION_SECOND_LEVEL, value);

            const firstLevel = value.split(".")[0];
            const remainingOccupationsInCategory = query
                .getAll(QueryNames.OCCUPATION_SECOND_LEVEL)
                .filter((secondLevel) => {
                    return secondLevel.startsWith(`${firstLevel}.`);
                });

            if (remainingOccupationsInCategory.length === 1) {
                query.remove(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel);
            }
        } else {
            query.remove(key, value);
        }
    };

    const handleFilterAddition = (key: string | undefined, value: string) => {
        if (key === QueryNames.PUBLISHED) {
            query.set(key, value);
        } else if (key === QueryNames.MUNICIPAL) {
            query.append(QueryNames.MUNICIPAL, value);

            const county = value.split(".")[0];
            if (!query.has(QueryNames.COUNTY, county)) {
                query.append(QueryNames.COUNTY, county);
            }
        } else if (key === QueryNames.COUNTRY) {
            query.append(QueryNames.COUNTRY, value);
            query.set(QueryNames.INTERNATIONAL, "true");
        } else if (key === QueryNames.OCCUPATION_SECOND_LEVEL) {
            query.append(QueryNames.OCCUPATION_SECOND_LEVEL, value);

            const firstLevel = value.split(".")[0];
            if (!query.has(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel)) {
                query.append(QueryNames.OCCUPATION_FIRST_LEVEL, firstLevel);
            }
        } else {
            query.append(key ?? "", value);
        }
    };

    const handleFilterOption = (option: string, isSelected: boolean) => {
        const parsedOption = parseOption(option);

        if (isSelected) {
            handleFilterAddition(parsedOption.key, parsedOption.value);
        } else if (parsedOption.key) {
            handleFilterRemoval(parsedOption.key, parsedOption.value);
        } else {
            handleFreeTextSearchOption(parsedOption.value, false);
        }
    };

    const onToggleSelected = (option: string, isSelected: boolean, isCustomOption: boolean) => {
        setErrorMessage(null);

        if (isCustomOption) {
            if (isValidFreeText(option)) {
                handleFreeTextSearchOption(option, isSelected);
                setShowComboboxList(false);
            } else {
                setShowComboboxList(false);
            }
        } else {
            handleFilterOption(option, isSelected);
            setShowComboboxList(false);
        }
    };

    return (
        <>
            <Combobox
                filteredOptions={filteredOptions}
                onChange={(value) => {
                    setInputValue(value);

                    if (value.length > 0 && value.length < 100) {
                        setShowComboboxList(undefined);
                    } else if (selectedOptions.length > 0) {
                        setShowComboboxList(false);
                    } else {
                        setShowComboboxList(undefined);
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
                shouldShowSelectedOptions={shouldShowSelectedOptions}
                options={optionList}
                error={errorMessage}
            />

            <Show below="sm">
                <ComboboxExternalItems
                    fontWeight="semibold"
                    itemsLeadingText="Søket ditt"
                    items={selectedOptions}
                    removeComboboxItem={(value: ComboboxItem) => {
                        if (typeof value === "string") {
                            handleFilterOption(value, false);
                        } else {
                            handleFilterOption(value.value, false);
                        }
                    }}
                />
            </Show>

            <ScreenReaderText selectedOptions={selectedOptions} />
        </>
    );
}

export default SearchCombobox;
