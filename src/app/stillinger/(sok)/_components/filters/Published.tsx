import { Radio, RadioGroup } from "@navikt/ds-react";
import { track } from "@/app/_common/umami";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import sortPublishedFiltersByDayOffset from "@/app/stillinger/(sok)/_components/utils/sortPublishedFiltersByDayOffset";
import { PublishedLabels } from "@/app/stillinger/(sok)/_utils/publishedLabels";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface PublishedProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
    publishedTotalCount: number | undefined;
}

export default function Published({ initialValues, updatedValues, publishedTotalCount }: PublishedProps) {
    const sortedValues = sortPublishedFiltersByDayOffset(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(value: string): void {
        if (value) {
            query.set(QueryNames.PUBLISHED, value);
        } else {
            query.remove(QueryNames.PUBLISHED);
        }
        track(value ? "Filter - la til filter" : "Filter - slettet filter", {
            filterSource: "menu",
            filterKey: QueryNames.PUBLISHED,
        });
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
