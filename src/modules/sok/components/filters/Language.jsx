import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_LANGUAGE, REMOVE_LANGUAGE } from "../../query";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import mergeCount from "../utils/mergeCount";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import findUnknownSearchCriteriaValues from "../utils/findUnknownSearchCriteriaValues";

function Language({ initialValues, updatedValues, query, dispatch }) {
    const [values, setValues] = useState(moveCriteriaToBottom(initialValues, "Ikke oppgitt"));
    console.log("INIT", initialValues);

    useEffect(() => {
        if (updatedValues) {
            const merged = mergeCount(values, updatedValues);
            setValues(merged);
        }
    }, [updatedValues]);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_LANGUAGE, value });
        } else {
            dispatch({ type: REMOVE_LANGUAGE, value });
        }
    }

    /**
     * This ensures that 'Annet' is displayed as 'Ikke oppgitt' in the search filters.
     * It's a mere cosmetic change since the value attributed to the checkbox
     * remains the same. The decision behind this particular change came due to
     * a problem in our structured data where most of the ads coming from different
     * stakeholders don't include the correct classification 'Fast'.
     * @param key
     * @returns {string|*}
     */
    function editedItemKey(key) {
        return key === "Annet" ? "Ikke oppgitt" : key;
    }

    return (
        <Fieldset legend="Språk" hideLegend>
            <div>
                {console.log("VALUES", values)}
                {values.map((item) => (
                    <Checkbox
                        name="language"
                        key={editedItemKey(item.key)}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.language.includes(item.key)}
                    >
                        {`${editedItemKey(item.key)} (${item.count})`}
                    </Checkbox>
                ))}
                <UnknownSearchCriteriaValues
                    namePrefix="language"
                    unknownValues={findUnknownSearchCriteriaValues(query.language, initialValues)}
                    checkedValues={query.language}
                    onClick={handleClick}
                />
            </div>
        </Fieldset>
    );
}

Language.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    query: PropTypes.shape({
        language: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Language;
