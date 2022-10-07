import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import CriteriaPanel from "./CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_SECTOR, REMOVE_SECTOR } from "../../query";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import mergeCount from "../utils/mergeCount";
import { findUnknownSearchCriteriaValues } from "../utils/findUnknownSearchCriteriaValues";
import { Checkbox } from "@navikt/ds-react";

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
            <fieldset className="CriteriaPanel__fieldset">
                <legend>Velg sektor</legend>
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
            </fieldset>
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
