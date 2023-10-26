import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select } from "@navikt/ds-react";
import { SET_SORTING } from "../../query";

function Sorting({ query, dispatch }) {
    const [sort, setSort] = useState(query.sort);

    function handleChange(e) {
        const { value } = e.target;
        setSort(value);
        dispatch({ type: SET_SORTING, value });
    }

    return (
        <Select onChange={handleChange} value={sort} label="Sorter etter" className="inline-select">
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
