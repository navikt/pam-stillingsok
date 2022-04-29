import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Checkbox } from "nav-frontend-skjema";
import CriteriaPanel from "../../../components/criteriaPanel/CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_SECTOR, REMOVE_SECTOR } from "../query";
import moveCriteriaToBottom from "./utils/moveFacetToBottom";
import mergeCount from "./utils/mergeCount";
import { findUnknownSearchCriteriaValues } from "./utils/findUnknownSearchCriteriaValues";

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
        <CriteriaPanel panelId="sector-panel" title="Sektor">
            {values.map((item) => (
                <Checkbox
                    name="sector"
                    key={item.key}
                    label={`${item.key} (${item.count})`}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.sector.includes(item.key)}
                />
            ))}

            <UnknownSearchCriteriaValues
                namePrefix="sector"
                unknownValues={findUnknownSearchCriteriaValues(query.sector, initialValues)}
                checkedValues={query.sector}
                onClick={handleClick}
            />
        </CriteriaPanel>
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
