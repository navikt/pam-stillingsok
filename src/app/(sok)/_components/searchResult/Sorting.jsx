import React from "react";
import PropTypes from "prop-types";
import { Select } from "@navikt/ds-react";
import { SET_SORTING } from "@/app/(sok)/_utils/queryReducer";

export const SortByValues = {
    RELEVANT: "relevant",
    PUBLISHED: "published",
    EXPIRES: "expires",
};

const DEFAULT_SORT = SortByValues.RELEVANT;

function Sorting({ query, dispatch }) {
    function handleChange(e) {
        const { value } = e.target;
        if (value === DEFAULT_SORT) {
            dispatch({ type: SET_SORTING, value: undefined });
        } else {
            dispatch({ type: SET_SORTING, value });
        }
    }

    return (
        <Select
            onChange={handleChange}
            value={query.sort || SortByValues.RELEVANT}
            label="Sorter etter"
            className="inline-select hide-label-sm"
        >
            <option value={SortByValues.RELEVANT}>Mest relevant</option>
            <option value={SortByValues.PUBLISHED}>Nyeste øverst</option>
            <option value={SortByValues.EXPIRES}>Søknadsfrist</option>
        </Select>
    );
}

Sorting.propTypes = {
    query: PropTypes.shape({
        sort: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Sorting;
