import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "../../query";
import Typeahead from "../../../common/components/typeahead/Typeahead";
import { FetchAction, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import SearchAPI from "../../../common/api/SearchAPI";
import capitalizeFirstLetter from "../../../common/utils/capitalizeFirstLetter";

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState("");
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

    function fetchSuggestions() {
        SearchAPI.getSuggestions({ match: value, minLength: MINIMUM_LENGTH })
            .then((response) => {
                suggestionsDispatch({ type: FetchAction.RESOLVE, data: removeDuplicateSuggestions(response) });
            })
            .catch(() => {
                suggestionsDispatch({ type: FetchAction.RESOLVE, data: [] });
            });
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
        <div className="SearchBox">
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