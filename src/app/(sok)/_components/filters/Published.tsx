import React, { ReactElement } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortPublishedValues from "@/app/(sok)/_components/utils/sortPublishedValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { PUBLISHED } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { PublishedLabels } from "@/app/(sok)/_utils/publishedLabels";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface PublishedProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
    publishedTotalCount: number;
}

export default function Published({ initialValues, updatedValues, publishedTotalCount }: PublishedProps): ReactElement {
    const sortedValues = sortPublishedValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleChange(value: string): void {
        if (value) {
            searchQuery.set(PUBLISHED, value);
        } else {
            searchQuery.remove(PUBLISHED);
        }
        logFilterChanged({ name: "Publisert", value: PublishedLabels[value] });
    }

    return (
        <RadioGroup
            onChange={handleChange}
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
