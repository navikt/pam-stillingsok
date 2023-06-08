import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_SECTOR, REMOVE_SECTOR } from "../../../query";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import mergeCount from "../utils/mergeCount";
import findUnknownSearchCriteriaValues from "../utils/findUnknownSearchCriteriaValues";

function Sector({ initialValues, updatedValues, query, dispatch }) {
    const [values, setValues] = useState(moveCriteriaToBottom(initialValues, "Ikke oppgitt"));

    useEffect(() => {
        if (updatedValues) {
            const merged = mergeCount(values, updatedValues);
            setValues(merged);
        }
    }, [updatedValues]);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_SECTOR, value });
        } else {
            dispatch({ type: REMOVE_SECTOR, value });
        }
    }

    return (
        <Fieldset legend="Sektor" className="mt-1" hideLegend>
            {values.map((item) => (
                <Checkbox
                    name="sector"
                    key={item.key}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.sector.includes(item.key)}
                >
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}

            <UnknownSearchCriteriaValues
                namePrefix="sector"
                unknownValues={findUnknownSearchCriteriaValues(query.sector, initialValues)}
                checkedValues={query.sector}
                onClick={handleClick}
            />
        </Fieldset>
    );
}

Sector.propTypes = {
    initialValues: PropTypes.arrayOf(PropTypes.shape({})),
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    sector: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ),
    query: PropTypes.shape({
        sector: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Sector;
