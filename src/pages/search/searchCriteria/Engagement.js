import {Checkbox} from "nav-frontend-skjema";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE} from "../query";
import CriteriaPanel from "../../../components/criteriaPanel/CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import mergeCount from "./utils/mergeCount";
import moveCriteriaToBottom from "./utils/moveFacetToBottom";
import {findUnknownSearchCriteriaValues} from "./utils/findUnknownSearchCriteriaValues";

function Engagement({initialValues, updatedValues, query, dispatch}) {
    const [values, setValues] = useState(moveCriteriaToBottom(initialValues, "Annet"));

    useEffect(() => {
        if (updatedValues) {
            const merged = mergeCount(values, updatedValues);
            setValues(merged);
        }
    }, [updatedValues]);

    function onEngagementClick(e) {
        const {value} = e.target;
        if (e.target.checked) {
            dispatch({type: ADD_ENGAGEMENT_TYPE, value});
        } else {
            dispatch({type: REMOVE_ENGAGEMENT_TYPE, value});
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
        <CriteriaPanel panelId="engagement-type-panel" title="Ansettelsesform">
            {values.map((item) => (
                <Checkbox
                    name="engagementType"
                    key={editedItemKey(item.key)}
                    label={`${editedItemKey(item.key)} (${item.count})`}
                    value={item.key}
                    onChange={onEngagementClick}
                    checked={query.engagementType.includes(item.key)}
                />
            ))}

            <UnknownSearchCriteriaValues
                namePrefix="engagementType"
                unknownValues={findUnknownSearchCriteriaValues(query.engagementType, initialValues)}
                checkedValues={query.engagementType}
                onClick={onEngagementClick}
            />
        </CriteriaPanel>
    );
}

Engagement.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        })
    ).isRequired,
    query: PropTypes.shape({
        engagementType: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Engagement;
