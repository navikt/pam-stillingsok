import PropTypes from "prop-types";
import React from "react";
import { SET_PUBLISHED } from "../../../query";
import { Checkbox, Fieldset } from "@navikt/ds-react";

export const PublishedLabelsEnum = {
    "now/d": "Nye i dag"
};

function Published({ dispatch, query, initialValues }) {
    const values = initialValues;

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: SET_PUBLISHED, value });
        } else {
            dispatch({ type: SET_PUBLISHED, undefined });
        }
    }

    return (
        <Fieldset legend="Publisert">
            {values.map((item) => (
                <Checkbox
                    name="published"
                    key={item.key}
                    value={item.key}
                    onChange={handleClick}
                    checked={query.published === item.key}
                >
                    {PublishedLabelsEnum[item.key]}
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
