import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "@/app/(sok)/_utils/queryReducer";
import Typeahead from "@/app/_common/components/typeahead/Typeahead";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import capitalizeFirstLetter from "@/app/_common/utils/capitalizeFirstLetter";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState(query.q);
    const initialRender = useRef(true);
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const MINIMUM_LENGTH = 1;

    /**
     * Use new Set to remove duplicates across category_suggest and searchtags_suggest
     */
    function removeDuplicateSuggestions(result) {
        return [
            ...new Set(
                [
                    ...result.suggest.searchtags_suggest[0].options.map((suggestion) =>
                        capitalizeFirstLetter(suggestion.text),
                    ),
                    ...result.suggest.category_suggest[0].options.map((suggestion) =>
                        capitalizeFirstLetter(suggestion.text),
                    ),
                ].sort(),
            ),
        ].slice(0, 10);
    }

    async function fetchSuggestions() {
        const cached = suggestionsCache.find((c) => c.value === value);
        if (cached) {
            suggestionsDispatch({ type: FetchAction.RESOLVE, data: cached.data });
            return;
        }

        try {
            const response = await fetch("/stillinger/api/suggestions", {
                body: JSON.stringify({ match: value, minLength: MINIMUM_LENGTH }),
                method: "POST",
                referrer: process.env.NEXT_PUBLIC_CONTEXT_PATH, // Todo: Er dette rett referrer?
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status !== 200) {
                suggestionsDispatch({ type: FetchAction.RESOLVE, data: [] });
            }

            let data = await response.json();
            data = removeDuplicateSuggestions(data);
            suggestionsCache = [{ value, data }, ...suggestionsCache].slice(0, CACHE_MAX_SIZE);
            suggestionsDispatch({ type: FetchAction.RESOLVE, data });
        } catch (e) {
            suggestionsDispatch({ type: FetchAction.RESOLVE, data: [] });
        }
    }

    useEffect(() => {
        setValue(query.q);
    }, [query.q]);

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
        let fields;
        setValue(newValue);
        if (!shouldSearchInWholeAd) {
            fields = "occupation";
        }

        dispatch({ type: SET_SEARCH_STRING, value: newValue, fields });
    }

    function handleSearchButtonClick() {
        const found = suggestionsResponse.data.find((it) => it.toLowerCase() === value.toLowerCase());
        let fields;
        if (found) {
            fields = "occupation";
        }

        dispatch({ type: SET_SEARCH_STRING, value, fields });
    }

    function onClear() {
        dispatch({ type: SET_SEARCH_STRING, value: "" });
    }

    // Add the current value as last suggestion entry,
    // This will show a typeahead suggestion like this: "Søk på {value} i hele annonsen"
    const allSuggestions = [...suggestionsResponse.data];
    if (suggestionsResponse.data.length > 0 && value && value.length > 0) {
        allSuggestions.push(value);
    }

    return (
        <div className="mb-4">
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
        </div>
    );
}

SearchBox.propTypes = {
    query: PropTypes.shape({
        q: PropTypes.string,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default SearchBox;
