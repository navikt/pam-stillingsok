import PropTypes from "prop-types";
import React from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { SET_PUBLISHED } from "@/app/(sok)/_utils/queryReducer";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";

function Published({ dispatch, query, initialValues, updatedValues }) {
    const values = mergeCount(initialValues, updatedValues);

    function handleClick(e) {
        const { value } = e.target;
        if (e.target.checked) {
            dispatch({ type: SET_PUBLISHED, value });
        } else {
            dispatch({ type: SET_PUBLISHED, undefined });
        }
    }

    return (
        <Fieldset legend="Filtrer etter når annonsen var publisert" hideLegend>
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
