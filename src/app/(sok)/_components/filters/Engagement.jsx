import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { ADD_ENGAGEMENT_TYPE, REMOVE_ENGAGEMENT_TYPE } from "@/app/(sok)/_utils/queryReducer";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortValuesByFirstLetter from "@/app/(sok)/_components/utils/sortValuesByFirstLetter";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

/**
 * This ensures that 'Annet' is displayed as 'Ikke oppgitt' in the search filters.
 * It's a mere cosmetic change since the value attributed to the checkbox
 * remains the same. The decision behind this particular change came due to
 * a problem in our structured data where most of the ads coming from different
 * stakeholders don't include the correct classification 'Fast'.
 * @param key
 * @returns {string|*}
 */
export function editedItemKey(key) {
    return key === "Annet" ? "Ikke oppgitt" : key;
}

function Engagement({ initialValues, updatedValues, query, dispatch }) {
    const sortedValuesByFirstLetter = sortValuesByFirstLetter(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByFirstLetter, "Annet");
    const values = mergeCount(sortedValues, updatedValues);

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_ENGAGEMENT_TYPE, value });
        } else {
            dispatch({ type: REMOVE_ENGAGEMENT_TYPE, value });
        }
        logFilterChanged({ name: "Ansettelsesform", value, checked });
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={query.engagementType}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">ansettelsesform</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="engagementType[]" key={editedItemKey(item.key)} value={item.key} onChange={handleClick}>
                    {`${editedItemKey(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

Engagement.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    query: PropTypes.shape({
        engagementType: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Engagement;
