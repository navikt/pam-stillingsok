import React from "react";
import PropTypes from "prop-types";
import { Select } from "@navikt/ds-react";
import { SET_SORTING } from "@/app/(sok)/_utils/queryReducer";

function Sorting({ query, dispatch }) {
    function handleChange(e) {
        const { value } = e.target;
        dispatch({ type: SET_SORTING, value });
    }

    return (
        <Select
            onChange={handleChange}
            value={query.sort || "published"}
            label="Sorter etter"
            className="inline-select hide-label-sm"
        >
            <option key="published" value="published">
                Nyeste øverst
            </option>
            <option key="relevant" value="relevant">
                Mest relevant
            </option>
            <option key="expires" value="expires">
                Søknadsfrist
            </option>
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
