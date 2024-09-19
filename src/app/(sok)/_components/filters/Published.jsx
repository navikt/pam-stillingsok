import PropTypes from "prop-types";
import React from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortPublishedValues from "@/app/(sok)/_components/utils/sortPublishedValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { PUBLISHED } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { PublishedLabels } from "@/app/(sok)/_utils/publishedLabels";

function Published({ initialValues, updatedValues, publishedTotalCount }) {
    const sortedValues = sortPublishedValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleClick(value) {
        if (value) {
            searchQuery.set(PUBLISHED, value);
        } else {
            searchQuery.remove(PUBLISHED);
        }
        logFilterChanged({ name: "Publisert", value: PublishedLabels[value] });
    }

    return (
        <RadioGroup
            onChange={handleClick}
            legend="Filtrer etter når annonsen var publisert"
            hideLegend
            value={searchQuery.get(PUBLISHED) || ""}
        >
            {values.map((item) => (
                <Radio key={item.key} value={item.key}>
                    {`${PublishedLabels[item.key]} (${item.count})`}
                </Radio>
            ))}
            <Radio value="">Vis alle ({publishedTotalCount})</Radio>
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
};

export default Published;
