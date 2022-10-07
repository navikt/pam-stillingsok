import PropTypes from "prop-types";
import React from "react";
import { SET_PUBLISHED } from "../../query";
import CriteriaPanel from "./CriteriaPanel";
import { Checkbox } from "@navikt/ds-react";

export const PublishedLabelsEnum = {
    "now/d": "Nye i dag"
};

function Published({ dispatch, query, values }) {
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
                        value={item.key}
                        onChange={handleClick}
                        checked={query.published === item.key}
                    >
                        {`${PublishedLabelsEnum[item.key]} (${item.count})`}
                    </Checkbox>
                ))}
            </div>
        </CriteriaPanel>
    );
}

Published.propTypes = {
    values: PropTypes.arrayOf(
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
