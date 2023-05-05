import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { SET_PUBLISHED } from "../../../query";
import mergeCount from "../utils/mergeCount";
import { Checkbox, Fieldset } from "@navikt/ds-react";

export const PublishedLabelsEnum = {
    "now/d": "Nye i dag"
};

function Published({ dispatch, query, initialValues, updatedValues }) {
    const [values, setValues] = useState(initialValues);

    useEffect(() => {
        if (updatedValues) {
            const merged = mergeCount(values, updatedValues);
            setValues(merged);
        }
    }, [updatedValues]);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: SET_PUBLISHED, value });
        } else {
            dispatch({ type: SET_PUBLISHED, undefined });
        }
    }

    return (
        <Fieldset legend="Publisert" hideLegend>
            {values.map((item) => (
                <Checkbox
                    name="published"
                    key={item.key}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.published === item.key}
                >
                    {`${PublishedLabelsEnum[item.key]} (${item.count})`}
                </Checkbox>
            ))}
        </Fieldset>
    );
}

Published.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number
        })
    ).isRequired,
    query: PropTypes.shape({
        published: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired
};

export default Published;
