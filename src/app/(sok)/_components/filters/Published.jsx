import PropTypes from "prop-types";
import React from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortPublishedValues from "@/app/(sok)/_components/utils/sortPublishedValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

export const PublishedLabelsEnum = {
    "now/d": "Nye i dag",
    "now-3d": "Nye siste 3 døgn",
    "now-7d": "Nye siste uka",
};

function Published({ initialValues, updatedValues, publishedTotalCount }) {
    const sortedValues = sortPublishedValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const router = useSearchRouter();
    const searchParams = useSearchParams();

    function handleClick(value) {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set(SearchQueryParams.PUBLISHED, value);
        } else {
            newSearchParams.delete(SearchQueryParams.PUBLISHED);
        }
        router.replace(newSearchParams, { scroll: false });
        logFilterChanged({ name: "Publisert", value: PublishedLabelsEnum[value] });
    }

    return (
        <RadioGroup
            name={SearchQueryParams.PUBLISHED}
            onChange={handleClick}
            legend="Filtrer etter når annonsen var publisert"
            hideLegend
            value={searchParams.get(SearchQueryParams.PUBLISHED) || ""}
        >
            {values.map((item) => (
                <Radio key={item.key} value={item.key}>
                    {`${PublishedLabelsEnum[item.key]} (${item.count})`}
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
