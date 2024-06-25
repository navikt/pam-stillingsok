import PropTypes from "prop-types";
import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { ADD_EXTENT, REMOVE_EXTENT } from "@/app/(sok)/_utils/queryReducer";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

function Extent({ initialValues, updatedValues, query, dispatch }) {
    const values = mergeCount(initialValues, updatedValues);

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_EXTENT, value });
        } else {
            dispatch({ type: REMOVE_EXTENT, value });
        }
        logFilterChanged({ name: "Omfang", value, checked });
    }

    return (
        <CheckboxGroup
            value={query.extent}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">omfang</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="extent[]" key={item.key} value={item.key} onChange={handleClick}>
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

Extent.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(PropTypes.shape({})),
    query: PropTypes.shape({
        extent: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Extent;
