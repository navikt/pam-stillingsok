import PropTypes from "prop-types";
import React from "react";
import { ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE } from "../../query";
import CriteriaPanel from "./CriteriaPanel";
import UnknownSearchCriteriaValues from "./UnknownSearchCriteriaValues";
import moveCriteriaToBottom from "../utils/moveFacetToBottom";
import { Checkbox } from "@navikt/ds-react";

function Engagement({ data, query, dispatch }) {
    const values = moveCriteriaToBottom(data.aggregations.engagementTypes, "Annet");

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: ADD_ENGAGEMENT_TYPE, value });
        } else {
            dispatch({ type: REMOVE_ENGAGEMENT_TYPE, value });
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
            <fieldset className="CriteriaPanel__fieldset">
                <legend>Velg ansettelsesform</legend>
                {values.map((item) => (
                    <Checkbox
                        name="engagementType"
                        key={editedItemKey(item.key)}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.engagementType.includes(item.key)}
                    >
                        {`${editedItemKey(item.key)} (${item.count})`}
                    </Checkbox>
                ))}
                <UnknownSearchCriteriaValues
                    namePrefix="engagementType"
                    unknownValues={data.unknown.engagementType}
                    checkedValues={query.engagementType}
                    onClick={handleClick}
                />
            </fieldset>
        </CriteriaPanel>
    );
}

Engagement.propTypes = {
    query: PropTypes.shape({
        engagementType: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Engagement;
