import React, { ReactElement } from "react";
import { Radio, RadioGroup } from "@navikt/ds-react";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import sortPublishedFiltersByDayOffset from "@/app/stillinger/(sok)/_components/utils/sortPublishedFiltersByDayOffset";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { PublishedLabels } from "@/app/stillinger/(sok)/_utils/publishedLabels";
import { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";

interface PublishedProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
    publishedTotalCount: number | undefined;
}

export default function Published({ initialValues, updatedValues, publishedTotalCount }: PublishedProps): ReactElement {
    const sortedValues = sortPublishedFiltersByDayOffset(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(value: string): void {
        if (value) {
            query.set(QueryNames.PUBLISHED, value);
        } else {
            query.remove(QueryNames.PUBLISHED);
        }
    }

    return (
        <RadioGroup
            onChange={handleChange}
            legend="Filtrer etter når annonsen var publisert"
            hideLegend
            value={query.get(QueryNames.PUBLISHED) || ""}
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
