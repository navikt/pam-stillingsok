import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FetchAction, useFetchReducer } from "@/app/_common/hooks/useFetchReducer";
import * as actions from "@/app/_common/actions";
import ComboBox from "@/app/(sok)/_components/searchBox/ComboBox";

let suggestionsCache = [];
const CACHE_MAX_SIZE = 50;
const MINIMUM_LENGTH = 1;

function SearchBox({ dispatch, query }) {
    const [value, setValue] = useState("");
    const [suggestionsResponse, suggestionsDispatch] = useFetchReducer([]);
    const initialRender = useRef(true);
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

    const allSuggestions = [...suggestionsResponse.data];

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
        } else if (value && value.length >= MINIMUM_LENGTH) {
            fetchSuggestions(value);
        } else {
            suggestionsDispatch({ type: FetchAction.SET_DATA, data: [] });
        }
    }, [value]);

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
                allSuggestions={allSuggestions}
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
