import PropTypes from "prop-types";
import React from "react";
import { ADD_SECTOR, REMOVE_SECTOR } from "../../../query";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import { Checkbox, Fieldset } from "@navikt/ds-react";

function Sector({ initialValues, query, dispatch }) {
    const values = moveCriteriaToBottom(initialValues, "Ikke oppgitt");

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_SECTOR, value });
        } else {
            dispatch({ type: REMOVE_SECTOR, value });
        }
    }

    return (
        <Fieldset legend="Sektor">
            {values.map((item) => (
                <Checkbox
                    name="sector"
                    key={item.key}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.sector.includes(item.key)}
                >
                    {item.key}
                </Checkbox>
            ))}
        </Fieldset>
    );
}

Sector.propTypes = {
    sector: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        })
    ),
    query: PropTypes.shape({
        sector: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Sector;
