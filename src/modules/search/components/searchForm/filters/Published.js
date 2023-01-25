import { Checkbox } from "nav-frontend-skjema";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { SET_PUBLISHED } from "../../../query";
import CriteriaPanel from "./CriteriaPanel";
import mergeCount from "../utils/mergeCount";

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
        <CriteriaPanel panelId="published-panel" title="Publisert">
            <div className="CriteriaPanel__fieldset">
                {values.map((item) => (
                    <Checkbox
                        name="published"
                        key={item.key}
                        label={`${PublishedLabelsEnum[item.key]} (${item.count})`}
                        value={item.key}
                        onChange={handleClick}
                        checked={query.published === item.key}
                    />
                ))}
            </div>
        </CriteriaPanel>
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
