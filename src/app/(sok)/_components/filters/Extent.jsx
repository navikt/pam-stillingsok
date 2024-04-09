import PropTypes from "prop-types";
import React from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_EXTENT, REMOVE_EXTENT } from "@/app/(sok)/_utils/queryReducer";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logSearchFilterAdded, logSearchFilterRemoved } from "@/app/_common/monitoring/amplitude";

function Extent({ initialValues, updatedValues, query, dispatch }) {
    const values = mergeCount(initialValues, updatedValues);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_EXTENT, value });
            logSearchFilterAdded({ extent: value });
        } else {
            dispatch({ type: REMOVE_EXTENT, value });
            logSearchFilterRemoved({ extent: value });
        }
    }

    function labelForExtent(item) {
        return item.key === "Heltid" ? `${item.key} eller ikke oppgitt` : `${item.key}`;
    }

    return (
        <Fieldset legend="Filtrer etter heltid/deltid" hideLegend>
            <div>
                {values.map((item) => (
                    <Checkbox
                        name="extent[]"
                        key={item.key}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.extent.includes(item.key)}
                    >
                        {`${labelForExtent(item)} (${item.count})`}
                    </Checkbox>
                ))}
            </div>
        </Fieldset>
    );
}

Extent.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    query: PropTypes.shape({
        extent: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Extent;
