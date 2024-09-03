import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import SearchCombobox from "@/app/(sok)/_components/searchBox/SearchCombobox";
import { getSearchBoxOptions } from "@/app/(sok)/_components/searchBox/buildSearchBoxOptions";

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

    const allSuggestions = [...suggestionsResponse.data];

    function handleValueChange(newValue) {
        setValue(newValue);
    }

    return (
        <section aria-label="Søk etter stilling" className="mb-4">
            <SearchCombobox
                queryDispatch={dispatch}
                query={query}
                onChange={handleValueChange}
                value={value}
                options={getSearchBoxOptions(aggregations, locations, allSuggestions)}
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
