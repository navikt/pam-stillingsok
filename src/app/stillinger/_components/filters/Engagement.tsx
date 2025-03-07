import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/stillinger/_components/utils/moveFilterToBottom";
import mergeCount from "@/app/stillinger/_components/utils/mergeCount";
import sortFiltersAlphabetically from "@/app/stillinger/_components/utils/sortFiltersAlphabetically";
import { QueryNames } from "@/app/stillinger/_utils/QueryNames";
import useQuery from "@/app/stillinger/_components/QueryProvider";
import { FilterAggregation } from "@/app/stillinger/_types/FilterAggregations";

/**
 * This ensures that 'Annet' is displayed as 'Ikke oppgitt' in the search filters.
 * It's a mere cosmetic change since the value attributed to the checkbox
 * remains the same. The decision behind this particular change came due to
 * a problem in our structured data where most of the ads coming from different
 * stakeholders don't include the correct classification 'Fast'.
 * @param key
 * @returns {string|*}
 */
export function editedItemKey(key: string): string {
    return key === "Annet" ? "Ikke oppgitt" : key;
}

interface EngagementProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Engagement({ initialValues, updatedValues }: EngagementProps): ReactElement {
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
