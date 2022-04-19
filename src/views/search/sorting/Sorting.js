import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select } from "nav-frontend-skjema";
import { SET_SORTING } from "../query";
import "./Sorting.less";

function Sorting({ query, dispatch }) {
    const [sort, setSort] = useState(query.sort);

    function handleChange(e) {
        const { value } = e.target;
        setSort(value);
        dispatch({ type: SET_SORTING, value });
    }

    return (
        <div className="Sorting">
            <Select
                onChange={handleChange}
                value={sort}
                label="Sortér etter"
                className="Sorting__Select"
            >
                <option key="relevant" value="relevant">
                    Mest relevant
                </option>
                <option key="published" value="published">
                    Vis nyeste øverst
                </option>
                <option key="expires" value="expires">
                    Søknadsfrist
                </option>
            </Select>
        </div>
    );
}

Sorting.propTypes = {
    query: PropTypes.shape({
        sort: PropTypes.string.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Sorting;
