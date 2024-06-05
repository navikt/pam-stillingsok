import PropTypes from "prop-types";
import React from "react";
import { Checkbox, Fieldset } from "@navikt/ds-react";
import { ADD_PUBLISHED, REMOVE_PUBLISHED } from "@/app/(sok)/_utils/queryReducer";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortPublishedValues from "@/app/(sok)/_components/utils/sortPublishedValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

function Published({ dispatch, query, initialValues, updatedValues }) {
    const sortedValues = sortPublishedValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);

    function handleClick(e) {
        const { value, checked } = e.target;
        if (checked) {
            dispatch({ type: ADD_PUBLISHED, value });
        } else {
            dispatch({ type: REMOVE_PUBLISHED, value });
        }
        logFilterChanged({ name: "Publisert", value: PublishedLabelsEnum[value], checked });
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
                        checked={query.published.includes(item.key)}
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
        published: PropTypes.array,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
};

export default Published;
