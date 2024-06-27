import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { ADD_REMOTE, REMOVE_REMOTE } from "@/app/(sok)/_utils/queryReducer";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortRemoteValues from "@/app/(sok)/_components/utils/sortRemoteValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

function Remote({ initialValues, updatedValues, query, dispatch }) {
    const sortedValuesByFirstLetter = sortRemoteValues(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);

    function labelForRemote(label) {
        switch (label) {
            case "Hybridkontor":
                return "Hybridkontor";
            case "Hjemmekontor":
                return "Kun hjemmekontor";
            default:
                return label;
        }
    }

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_REMOTE, value });
        } else {
            dispatch({ type: REMOVE_REMOTE, value });
        }
        logFilterChanged({ name: "Hjemmekontor", value: labelForRemote(value), checked });
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={query.remote}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">hjemmekontor</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="remote[]" key={item.key} value={item.key} onChange={handleClick}>
                    {`${labelForRemote(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

export default Remote;
