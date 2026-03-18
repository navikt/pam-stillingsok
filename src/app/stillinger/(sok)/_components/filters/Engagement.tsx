import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/stillinger/(sok)/_components/utils/moveFilterToBottom";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import sortFiltersAlphabetically from "@/app/stillinger/(sok)/_components/utils/sortFiltersAlphabetically";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { type FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import { editedItemKey } from "@/app/stillinger/(sok)/_components/filters/getKeys";

interface EngagementProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Engagement({ initialValues, updatedValues }: EngagementProps) {
    const sortedValuesByFirstLetter = sortFiltersAlphabetically(initialValues);
    const sortedValues = moveFilterToBottom(sortedValuesByFirstLetter, "Annet");
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.ENGAGEMENT_TYPE, value);
        } else {
            query.remove(QueryNames.ENGAGEMENT_TYPE, value);
        }
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={query.getAll(QueryNames.ENGAGEMENT_TYPE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">ansettelsesform</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox
                    name="engagementType[]"
                    key={editedItemKey(item.key)}
                    value={item.key}
                    onChange={handleChange}
                >
                    {`${editedItemKey(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
