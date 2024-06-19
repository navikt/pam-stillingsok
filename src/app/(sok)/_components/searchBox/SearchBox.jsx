import React, { useEffect, useRef, useState } from "react";
import Typeahead from "@/app/_common/components/typeahead/Typeahead";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;

function getSearchBoxValue(searchParams) {
    let initialValue = "";
    if (searchParams.has(SearchQueryParams.Q)) {
        initialValue = searchParams.get(SearchQueryParams.Q);
    } else if (searchParams.has(SearchQueryParams.OCCUPATION)) {
        // eslint-disable-next-line prefer-destructuring
        initialValue = searchParams.get(SearchQueryParams.OCCUPATION);
    }
    return initialValue;
}

function SearchBox() {
    const searchParams = useSearchParams();
    const router = useSearchRouter();
    const [value, setValue] = useState(getSearchBoxValue(searchParams));
    const initialRender = useRef(true);
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const MINIMUM_LENGTH = 1;

    async function fetchSuggestions() {
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

    useEffect(() => {
        setValue(getSearchBoxValue(searchParams));
    }, [searchParams]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else if (value && value.length >= MINIMUM_LENGTH) {
            fetchSuggestions(value);
        } else {
            suggestionsDispatch({ type: FetchAction.SET_DATA, data: [] });
        }
    }, [value]);

    function handleTypeAheadValueChange(newValue) {
        setValue(newValue);
    }

    function handleTypeAheadSuggestionSelected(newValue, shouldSearchInWholeAd) {
        setValue(newValue);
        const newSearchParams = new URLSearchParams(searchParams);
        if (shouldSearchInWholeAd) {
            newSearchParams.delete(SearchQueryParams.OCCUPATION);
            newSearchParams.set(SearchQueryParams.Q, newValue);
        } else {
            newSearchParams.delete(SearchQueryParams.Q);
            newSearchParams.set(SearchQueryParams.OCCUPATION, newValue);
        }

        if (newSearchParams.get(SearchQueryParams.SORT) !== "expires") {
            if (!shouldSearchInWholeAd) {
                newSearchParams.set(SearchQueryParams.SORT, "published");
            } else if (newValue) {
                newSearchParams.set(SearchQueryParams.SORT, "relevant");
            } else {
                newSearchParams.delete(SearchQueryParams.SORT);
            }
        }
        router.replace(newSearchParams, { scroll: false });
    }

    function handleSearchButtonClick() {
        const isOccupationSuggestion = suggestionsResponse.data.find((it) => it.toLowerCase() === value.toLowerCase());
        const newSearchParams = new URLSearchParams(searchParams);

        if (!value) {
            newSearchParams.delete(SearchQueryParams.OCCUPATION);
            newSearchParams.delete(SearchQueryParams.Q);
        } else if (isOccupationSuggestion) {
            newSearchParams.delete(SearchQueryParams.Q);
            newSearchParams.set(SearchQueryParams.OCCUPATION, value);
            newSearchParams.set(SearchQueryParams.SORT, "published");
        } else {
            newSearchParams.delete(SearchQueryParams.OCCUPATION);
            newSearchParams.set(SearchQueryParams.Q, value);
            newSearchParams.set(SearchQueryParams.SORT, "relevant");
        }
        router.replace(newSearchParams, { scroll: false });
    }

    function onClear() {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete(SearchQueryParams.Q);
        newSearchParams.delete(SearchQueryParams.OCCUPATION);
        router.replace(newSearchParams, { scroll: false });
    }

    // Add the current value as last suggestion entry,
    // This will show a typeahead suggestion like this: "Søk på {value} i hele annonsen"
    const allSuggestions = [...suggestionsResponse.data];
    if (suggestionsResponse.data.length > 0 && value && value.length > 0) {
        allSuggestions.push(value);
    }

    return (
        <section aria-label="Søkeord" className="mb-4">
            <Typeahead
                onClear={onClear}
                id="search-form-fritekst-input"
                name="q"
                autoComplete="off"
                onSelect={handleTypeAheadSuggestionSelected}
                onChange={handleTypeAheadValueChange}
                suggestions={value && value.length > 0 ? allSuggestions : []}
                value={value || ""}
                onSearchButtonClick={handleSearchButtonClick}
            />
        </section>
    );
}

export default SearchBox;
