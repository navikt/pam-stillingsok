import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import ComboBox from "@/app/(sok)/_components/combobox/ComboBox";
import { getComboboxOptions } from "@/app/(sok)/_components/combobox/comboboxUtils";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;
const MINIMUM_LENGTH = 1;

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

function SearchBox({ dispatch, query, aggregations, locations }) {
    const [value, setValue] = useState(getSearchBoxValue(query));
    // const [value, setValue] = useState("");
    const initialRender = useRef(true);
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);

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

    // function handleTypeAheadValueChange(newValue) {
    //     setValue(newValue);
    // }
    //
    // function handleTypeAheadSuggestionSelected(newValue, shouldSearchInWholeAd) {
    //     setValue(newValue);
    //     if (!shouldSearchInWholeAd) {
    //         dispatch({ type: ADD_OCCUPATION, value: newValue });
    //     } else {
    //         dispatch({ type: SET_SEARCH_STRING, value: newValue });
    //     }
    // }
    //
    // function handleSearchButtonClick() {
    //     const found = suggestionsResponse.data.find((it) => it.toLowerCase() === value.toLowerCase());
    //     if (found) {
    //         dispatch({ type: ADD_OCCUPATION, value });
    //     } else {
    //         dispatch({ type: SET_SEARCH_STRING, value });
    //     }
    // }
    //
    // function onClear() {
    //     dispatch({ type: SET_SEARCH_STRING, value: "" });
    // }

    // Add the current value as last suggestion entry,
    // This will show a typeahead suggestion like this: "Søk på {value} i hele annonsen"
    const allSuggestions = [...suggestionsResponse.data];
    // if (suggestionsResponse.data.length > 0 && value && value.length > 0) {
    //     allSuggestions.push(value);
    // }

    function handleComboBoxValueChange(event) {
        setValue(event?.target?.value || "");
    }

    return (
        <section aria-label="Søkeord" className="mb-4">
            <ComboBox
                queryDispatch={dispatch}
                query={query}
                onChange={handleComboBoxValueChange}
                value={value}
                options={getComboboxOptions(aggregations, locations, allSuggestions)}
            />
        </section>
    );
}

SearchBox.propTypes = {
    query: PropTypes.shape({
        q: PropTypes.string,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    locations: PropTypes.arrayOf(PropTypes.shape({})),
};

export default SearchBox;
