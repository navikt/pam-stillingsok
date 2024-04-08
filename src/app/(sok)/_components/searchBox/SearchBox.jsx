import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "@/app/(sok)/_utils/queryReducer";
import Typeahead from "@/app/_common/components/typeahead/Typeahead";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState(query.q);
    const initialRender = useRef(true);
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const MINIMUM_LENGTH = 1;

    async function fetchSuggestions() {
        const cached = suggestionsCache.find((c) => c.value === value);
        if (cached) {
            suggestionsDispatch({ type: FetchAction.RESOLVE, data: cached.data });
            return;
        }

        const data = await actions.getSuggestions(value, MINIMUM_LENGTH);
        suggestionsCache = [{ value, data }, ...suggestionsCache].slice(0, CACHE_MAX_SIZE);
        suggestionsDispatch({ type: FetchAction.RESOLVE, data });
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
