import PropTypes from "prop-types";
import React from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_SECTOR, REMOVE_SECTOR } from "@/app/(sok)/_utils/queryReducer";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logSearchFilterAdded, logSearchFilterRemoved } from "@/app/_common/monitoring/amplitude";

function Sector({ initialValues, updatedValues, query, dispatch }) {
    const values = mergeCount(initialValues, updatedValues);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_SECTOR, value });
            logSearchFilterAdded({ sektor: value });
        } else {
            dispatch({ type: REMOVE_SECTOR, value });
            logSearchFilterRemoved({ sektor: value });
        }
    }

    return (
        <Fieldset legend="Filtrer etter sektor" hideLegend>
            <div>
                {values.map((item) => (
                    <Checkbox
                        name="sector[]"
                        key={item.key}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.sector.includes(item.key)}
                    >
                        {`${item.key} (${item.count})`}
                    </Checkbox>
                ))}
            </div>
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
