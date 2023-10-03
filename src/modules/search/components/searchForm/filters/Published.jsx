import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { PublishedLabelsEnum, SET_PUBLISHED } from "../../../query";
import mergeCount from "../utils/mergeCount";

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
            <div>
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
            </div>
        </Fieldset>
    );
}

Published.propTypes = {
    initialValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ).isRequired,
    updatedValues: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            count: PropTypes.number,
        }),
    ),
    query: PropTypes.shape({
        published: PropTypes.string,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Published;
