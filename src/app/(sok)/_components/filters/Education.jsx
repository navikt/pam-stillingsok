import PropTypes from "prop-types";
import React from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_EDUCATION, REMOVE_EDUCATION } from "@/app/(sok)/_utils/queryReducer";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logSearchFilterAdded, logSearchFilterRemoved } from "@/app/_common/monitoring/amplitude";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";

function Education({ initialValues, updatedValues, query, dispatch }) {
    const sortedValues = moveCriteriaToBottom(initialValues, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_EDUCATION, value });
            logSearchFilterAdded({ education: value });
        } else {
            dispatch({ type: REMOVE_EDUCATION, value });
            logSearchFilterRemoved({ education: value });
        }
    }

    const updateViewName = (key) => {
        switch (key) {
            case "Ingen krav":
                return "Ingen krav til utdanning";
            case "Master":
                return "Master eller tilsvarende";
            case "Videregående":
                return "Videregående skole";
            default:
                return key;
        }
    };

    return (
        <Fieldset legend="Filtrer på utdanning" hideLegend>
            <div>
                {values.map((item) => (
                    <Checkbox
                        name="education[]"
                        key={item.key}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.education.includes(item.key)}
                    >
                        {`${updateViewName(item.key)} (${item.count})`}
                    </Checkbox>
                ))}
            </div>
        </Fieldset>
    );
}

Education.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    query: PropTypes.shape({
        education: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Education;
