import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { SET_SEARCH_STRING } from "../query";
import Typeahead from "../../../components/typeahead/Typeahead";
import {FetchAction, useFetchReducer} from "../../../hooks/useFetchReducer";
import { fetchCategoryAndSearchTagsSuggestions } from "../../../api/search/api";
import useDebounce from "../../../hooks/useDebounce";

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState(query.q);
    const debouncedValue = useDebounce(value);
    const initialRender = useRef(true);
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const MINIMUM_LENGTH = 3;

    function fetchSuggestions() {
        fetchCategoryAndSearchTagsSuggestions(value, MINIMUM_LENGTH)
            .then((response) => {
                suggestionsDispatch({ type: FetchAction.RESOLVE, data: response.result });
            })
            .catch(() => {
                suggestionsDispatch({ type: FetchAction.RESOLVE, data: [] });
            });
    }

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else {
            if (debouncedValue && debouncedValue.length >= MINIMUM_LENGTH) {
                fetchSuggestions(debouncedValue);
            } else {
                suggestionsDispatch({ type: FetchAction.SET_DATA, data: [] });
            }
        }
    }, [debouncedValue]);

    function onTypeAheadValueChange(value) {
        setValue(value);
    }

    function onTypeAheadSuggestionSelected(value) {
        setValue(value);
        dispatch({ type: SET_SEARCH_STRING, value });
    }

    function onSearchButtonClick() {
        dispatch({ type: SET_SEARCH_STRING, value });
    }

    return (
        <div>
            <div className="SearchBox">
                <Typeahead
                    id="search-form-fritekst-input"
                    name="q"
                    autoComplete="off"
                    ariaLabel="Søk"
                    placeholder="Søk"
                    onSelect={onTypeAheadSuggestionSelected}
                    onChange={onTypeAheadValueChange}
                    suggestions={suggestionsResponse.data}
                    value={value ? value : ""}
                />
                <button type="submit" className="SearchBox__button" onClick={onSearchButtonClick}>
                    <span className="SearchBox__button__icon">
                        <span className="sr-only">Søk</span>
                    </span>
                </button>
            </div>
        </div>
    );
}

SearchBox.propTypes = {
    query: PropTypes.shape({
        q: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default SearchBox;
