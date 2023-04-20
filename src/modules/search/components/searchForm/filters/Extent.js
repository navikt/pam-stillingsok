import PropTypes from "prop-types";
import React from "react";
import { ADD_EXTENT, REMOVE_EXTENT } from "../../../query";
import { Checkbox, Fieldset } from "@navikt/ds-react";

function Extent({ initialValues, query, dispatch }) {
    const values = initialValues;

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_EXTENT, value });
        } else {
            dispatch({ type: REMOVE_EXTENT, value });
        }
    }

    function labelForExtent(item) {
        return item.key === "Heltid" ? `${item.key} eller ikke oppgitt` : `${item.key}`;
    }

    return (
        <Fieldset legend="Heltid/deltid">
            {values.map((item) => (
                <Checkbox
                    name="extent"
                    key={item.key}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.extent.includes(item.key)}
                >
                    {labelForExtent(item)}
                </Checkbox>
            ))}
        </Fieldset>
    );
}

Extent.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        })
    ).isRequired,
    query: PropTypes.shape({
        extent: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Extent;
