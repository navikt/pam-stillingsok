import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_EXTENT, REMOVE_EXTENT } from "../../../query";
import mergeCount from "../utils/mergeCount";
import { findUnknownSearchCriteriaValues } from "../utils/findUnknownSearchCriteriaValues";
import { Checkbox, Fieldset } from "@navikt/ds-react";

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
        <Fieldset legend="Heltid/deltid" className="mt-1" hideLegend>
            {values.map((item) => (
                <Checkbox
                    name="extent"
                    key={item.key}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.extent.includes(item.key)}
                >
                    {`${labelForExtent(item)} (${item.count})`}
                </Checkbox>
            ))}

            <UnknownSearchCriteriaValues
                namePrefix="extent"
                unknownValues={findUnknownSearchCriteriaValues(query.extent, initialValues)}
                checkedValues={query.extent}
                onClick={handleClick}
            />
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