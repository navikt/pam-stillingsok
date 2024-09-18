import { UNSAFE_Combobox as Combobox } from "@navikt/ds-react";
import React, { useMemo } from "react";
import { buildSelectedOptions } from "@/app/(sok)/_components/searchBox/buildSelectedOptions";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import {
    COUNTRY,
    COUNTY,
    EDUCATION,
    ENGAGEMENT_TYPE,
    EXPERIENCE,
    EXTENT,
    INTERNATIONAL,
    MUNICIPAL,
    NEED_DRIVERS_LICENSE,
    OCCUPATION,
    OCCUPATION_FIRST_LEVEL,
    OCCUPATION_SECOND_LEVEL,
    PUBLISHED,
    REMOTE,
    SEARCH_STRING,
    SECTOR,
    WORK_LANGUAGE,
} from "@/app/(sok)/_components/searchParamNames";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import { findLabelForFilter, getSearchBoxOptions } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;
const MINIMUM_LENGTH = 1;

const AMPLITUDE_KEY_MAPPING = {
    [COUNTY]: {
        name: "Sted",
        level: "Fylke",
    },

    [COUNTRY]: {
        name: "Sted",
        level: "Land",
    },
    [ENGAGEMENT_TYPE]: {
        name: "Ansettelsesform",
    },
    [EDUCATION]: {
        name: "Utdanningsnivå",
    },
    [EXPERIENCE]: {
        name: "Erfaring",
    },
    [EXTENT]: {
        name: "Omfang",
    },
    [MUNICIPAL]: {
        name: "Sted",
        level: "Kommune",
    },
    [NEED_DRIVERS_LICENSE]: {
        name: "Førerkort",
    },
    [OCCUPATION]: {
        name: "Yrke",
    },
    [OCCUPATION_FIRST_LEVEL]: {
        name: "Yrkeskategori",
        level: "Yrkesnivå 1",
    },
    [OCCUPATION_SECOND_LEVEL]: {
        name: "Yrkeskategori",
        level: "Yrkesnivå 2",
    },
    [PUBLISHED]: {
        name: "Publisert",
    },
    [REMOTE]: {
        name: "Hjemmekontor",
    },
    [SECTOR]: {
        name: "Sektor",
    },
    [WORK_LANGUAGE]: {
        name: "Arbeidsspråk",
    },
};

function SearchCombobox({ aggregations, locations }) {
    const searchQuery = useSearchQuery();
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);

    const options = useMemo(
        () => getSearchBoxOptions(aggregations, locations, [...suggestionsResponse.data]),
        [aggregations, locations, suggestionsResponse.data],
    );

    const selectedOptions = useMemo(
        () => buildSelectedOptions(searchQuery.urlSearchParams),
        [searchQuery.urlSearchParams],
    );

    const optionList = options.map((o) => {
        const filterLabel = findLabelForFilter(o.value.split("-")[0]);
        return filterLabel
            ? { label: `${o.label} ${filterLabel}`, value: o.value }
            : { label: o.label, value: o.value };
    });

    async function fetchSuggestions(value) {
        const cached = suggestionsCache.find((c) => c.value === value);
        if (cached) {
            suggestionsDispatch({ type: FetchAction.RESOLVE, data: cached.data });
            return;
        }
        let data;
        try {
            data = await actions.getSuggestions(value, MINIMUM_LENGTH);
        } catch (err) {
            // ignore fetch failed errors
        }
        if (data) {
            suggestionsCache = [{ value, data }, ...suggestionsCache].slice(0, CACHE_MAX_SIZE);
            suggestionsDispatch({ type: FetchAction.RESOLVE, data });
        }
    }

    function handleValueChange(value) {
        if (value && value.length >= MINIMUM_LENGTH) {
            fetchSuggestions(value);
        }
    }

    const handleFreeTextSearchOption = (value, isSelected) => {
        if (isSelected) {
            searchQuery.append(SEARCH_STRING, value);
        } else {
            searchQuery.remove(SEARCH_STRING, value);
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
        // håndter "value" for Yrkesnivå 2
        const ampValue =
            AMPLITUDE_KEY_MAPPING[key] && AMPLITUDE_KEY_MAPPING[key].level === "Yrkesnivå 2"
                ? value.split(".")[1]
                : value;
        logFilterChanged({ ...AMPLITUDE_KEY_MAPPING[key], value: ampValue, checked: false, source: "Søkefelt" });
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
        // håndter "value" for Yrkesnivå 2
        const ampValue =
            AMPLITUDE_KEY_MAPPING[key] && AMPLITUDE_KEY_MAPPING[key].level === "Yrkesnivå 2"
                ? value.split(".")[1]
                : value;
        logFilterChanged({ ...AMPLITUDE_KEY_MAPPING[key], value: ampValue, checked: true, source: "Søkefelt" });
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
            shouldAutocomplete
            allowNewValues
            label="Legg til sted, yrker og andre søkeord"
            isMultiSelect
            onToggleSelected={onToggleSelected}
            selectedOptions={selectedOptions}
            options={optionList}
            onChange={handleValueChange}
        />
    );
}

export default SearchCombobox;
