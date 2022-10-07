import PropTypes from "prop-types";
import React from "react";
import CriteriaPanel from "./CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_EXTENT, REMOVE_EXTENT } from "../../query";
import { Checkbox } from "@navikt/ds-react";

function Extent({ data, query, dispatch }) {
    const values = data.aggregations.extent;

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
            <fieldset className="CriteriaPanel__fieldset">
                <legend>Velg heltid eller deltid</legend>
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
                    unknownValues={data.unknown.extent}
                    checkedValues={query.extent}
                    onClick={handleClick}
                />
            </fieldset>
        </CriteriaPanel>
    );
}

Extent.propTypes = {
    query: PropTypes.shape({
        extent: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Extent;
