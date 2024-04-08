import React from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_REMOTE, REMOVE_REMOTE } from "@/app/(sok)/_utils/queryReducer";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logSearchFilterAdded, logSearchFilterRemoved } from "@/app/_common/monitoring/amplitude";

function Remote({ initialValues, updatedValues, query, dispatch }) {
    const values = mergeCount(initialValues, updatedValues);
    const sortedValues = moveCriteriaToBottom(values, "Ikke oppgitt");

    function labelForRemote(label) {
        switch (label) {
            case "Hybridkontor":
                return "Hybrid";
            case "Hjemmekontor":
                return "Kun hjemmekontor";
            default:
                return label;
        }
    }

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_REMOTE, value });
            logSearchFilterAdded({ remote: value });
        } else {
            dispatch({ type: REMOVE_REMOTE, value });
            logSearchFilterRemoved({ remote: value });
        }
    }

    return (
        <Fieldset legend="Remote" hideLegend>
            <div>
                {sortedValues.map((item) => (
                    <Checkbox
                        name="remote[]"
                        key={item.key}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.remote.includes(item.key)}
                    >
                        {`${labelForRemote(item.key)} (${item.count})`}
                    </Checkbox>
                ))}
            </div>
        </Fieldset>
    );
}

export default Remote;
