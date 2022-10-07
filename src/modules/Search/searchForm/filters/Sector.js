import PropTypes from "prop-types";
import React from "react";
import CriteriaPanel from "./CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import { ADD_SECTOR, REMOVE_SECTOR } from "../../query";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import { Checkbox } from "@navikt/ds-react";

function Sector({ data, query, dispatch }) {
    const values = moveCriteriaToBottom(data.aggregations.sector, "Ikke oppgitt");

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
                    unknownValues={data.unknown.sector}
                    checkedValues={query.sector}
                    onClick={handleClick}
                />
            </fieldset>
        </CriteriaPanel>
    );
}

Sector.propTypes = {
    query: PropTypes.shape({
        sector: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Sector;
