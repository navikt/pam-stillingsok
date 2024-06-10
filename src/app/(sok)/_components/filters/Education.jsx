import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_EDUCATION, REMOVE_EDUCATION } from "@/app/(sok)/_utils/queryReducer";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import sortEducationValues from "@/app/(sok)/_components/utils/sortEducationValues";

function Education({ initialValues, updatedValues, query, dispatch }) {
    const sortedValuesByEducation = sortEducationValues(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByEducation, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_EDUCATION, value });
        } else {
            dispatch({ type: REMOVE_EDUCATION, value });
        }
        logFilterChanged({ name: "Utdanningsnivå", value, checked });
    }

    return (
        <Fieldset
            className="mb-4"
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">Utdanning</span>
                </>
            }
        >
            <div>
                {values.map((item) => (
                    <Checkbox
                        name="education[]"
                        key={item.key}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.education.includes(item.key)}
                    >
                        {`${labelForEducation(item.key)} (${item.count})`}
                    </Checkbox>
                ))}
            </div>
        </Fieldset>
    );
}

export const labelForEducation = (key) => {
    switch (key) {
        case "Ingen krav":
            return "Ingen krav til utdanning";
        case "Master":
            return "Master eller tilsvarende";
        case "Videregående":
            return "Videregående skole";
        case "Fagbrev":
            return "Fag- eller svennebrev";
        case "Fagskole":
            return "Fagskole eller tilsvarende";
        case "Bachelor":
            return "Bachelor eller tilsvarende";
        default:
            return key;
    }
};

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
