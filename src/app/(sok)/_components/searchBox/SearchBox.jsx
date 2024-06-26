import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ADD_OCCUPATION, SET_SEARCH_STRING } from "@/app/(sok)/_utils/queryReducer";
import Typeahead from "@/app/_common/components/typeahead/Typeahead";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;

function getSearchBoxValue(query) {
    let initialValue = "";
    if (query.q) {
        initialValue = query.q;
    } else if (query.occupations[0]) {
        // eslint-disable-next-line prefer-destructuring
        initialValue = query.occupations[0];
    }
    return initialValue;
}

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState(getSearchBoxValue(query));
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
        setValue(getSearchBoxValue(query));
    }, [query.q, query.occupations]);

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
        if (!shouldSearchInWholeAd) {
            dispatch({ type: ADD_OCCUPATION, value: newValue });
        } else {
            dispatch({ type: SET_SEARCH_STRING, value: newValue });
        }
    }

    function handleSearchButtonClick() {
        const found = suggestionsResponse.data.find((it) => it.toLowerCase() === value.toLowerCase());
        if (found) {
            dispatch({ type: ADD_OCCUPATION, value });
        } else {
            dispatch({ type: SET_SEARCH_STRING, value });
        }
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

SearchBox.propTypes = {
    query: PropTypes.shape({
        q: PropTypes.string,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default SearchBox;
