import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "../../query";
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member
import Typeahead from "../../../../common/components/typeahead/Typeahead";
import { FetchAction, useFetchReducer } from "../../../../common/hooks/useFetchReducer";
import useDebounce from "../../../../common/hooks/useDebounce";
import SearchAPI from "../../../../common/api/SearchAPI";
import capitalizeFirstLetter from "../../../../common/utils/capitalizeFirstLetter";

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);
    const initialRender = useRef(true);
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const MINIMUM_LENGTH = 3;

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
        ];
    }

    function fetchSuggestions() {
        SearchAPI.get("api/suggestions", { match: value, minLength: MINIMUM_LENGTH })
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
        } else if (debouncedValue && debouncedValue.length >= MINIMUM_LENGTH) {
            fetchSuggestions(debouncedValue);
        } else {
            suggestionsDispatch({ type: FetchAction.SET_DATA, data: [] });
        }
    }, [debouncedValue]);

    function handleTypeAheadValueChange(newValue) {
        setValue(newValue);
    }

    function handleTypeAheadSuggestionSelected(newValue) {
        setValue(newValue);
        //  dispatch({ type: SET_MATCH, value: "occupation" });
        dispatch({ type: SET_SEARCH_STRING, value: newValue });
    }

    function handleSearchButtonClick() {
        //   dispatch({ type: SET_MATCH, value: undefined });
        dispatch({ type: SET_SEARCH_STRING, value });
    }

    return (
        <div className="SearchBox">
            <Typeahead
                id="search-form-fritekst-input"
                name="q"
                autoComplete="off"
                onSelect={handleTypeAheadSuggestionSelected}
                onChange={handleTypeAheadValueChange}
                suggestions={suggestionsResponse.data}
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
