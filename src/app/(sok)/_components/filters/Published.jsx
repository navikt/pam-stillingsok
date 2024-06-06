import PropTypes from "prop-types";
import React from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { SET_PUBLISHED } from "@/app/(sok)/_utils/queryReducer";
import { PublishedLabelsEnum } from "@/app/(sok)/_utils/query";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortPublishedValues from "@/app/(sok)/_components/utils/sortPublishedValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";

function Published({ dispatch, query, initialValues, updatedValues }) {
    const sortedValues = sortPublishedValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);

    function handleClick(value) {
        if (value) {
            dispatch({ type: SET_PUBLISHED, value });
        } else {
            dispatch({ type: SET_PUBLISHED, value: "" });
        }
        logFilterChanged({ name: "Publisert", value: PublishedLabelsEnum[value] });
    }

    return (
        <RadioGroup
            name="published"
            onChange={handleClick}
            legend="Filtrer etter når annonsen var publisert"
            hideLegend
            value={query.published || ""}
        >
            <Radio value="">Vis alle</Radio>
            {values.map((item) => (
                <Radio key={item.key} value={item.key}>
                    {`${PublishedLabelsEnum[item.key]} (${item.count})`}
                </Radio>
            ))}
        </RadioGroup>
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
