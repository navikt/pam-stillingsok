import { Checkbox } from "nav-frontend-skjema";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import CriteriaPanel from "../../../components/criteriaPanel/CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_EXTENT, REMOVE_EXTENT } from "../query";
import mergeCount from "./utils/mergeCount";
import { findUnknownSearchCriteriaValues } from "./utils/findUnknownSearchCriteriaValues";

function Extent({ initialValues, updatedValues, query, dispatch }) {
    const [values, setValues] = useState(initialValues);

    useEffect(() => {
        if (updatedValues) {
            const merged = mergeCount(values, updatedValues);
            setValues(merged);
        }
    }, [updatedValues]);

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
        <CriteriaPanel panelId="extent-panel" title="Heltid/deltid">
            {values.map((item) => (
                <Checkbox
                    name="extent"
                    key={item.key}
                    label={`${labelForExtent(item)} (${item.count})`}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.extent.includes(item.key)}
                />
            ))}

            <UnknownSearchCriteriaValues
                namePrefix="extent"
                unknownValues={findUnknownSearchCriteriaValues(query.extent, initialValues)}
                checkedValues={query.extent}
                onClick={handleClick}
            />
        </CriteriaPanel>
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
