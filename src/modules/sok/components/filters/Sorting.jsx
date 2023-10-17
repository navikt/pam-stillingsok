import React, { useState } from "react";
import PropTypes from "prop-types";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { SET_SORTING } from "../../query";

function Sorting({ query, dispatch }) {
    const [sort, setSort] = useState(query.sort);

    function handleChange(value) {
        setSort(value);
        dispatch({ type: SET_SORTING, value });
    }

    return (
        <RadioGroup onChange={handleChange} value={sort} legend="Sorter søketreff">
            <Radio value="relevant">Mest relevant</Radio>
            <Radio value="published">Vis nyeste øverst</Radio>
            <Radio value="expires">Søknadsfrist</Radio>
        </RadioGroup>
    );
}

Sorting.propTypes = {
    query: PropTypes.shape({
        sort: PropTypes.string.isRequired,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Sorting;
