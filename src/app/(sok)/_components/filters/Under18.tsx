import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface Under18Props {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Under18({ initialValues, updatedValues }: Under18Props): ReactElement {
    const sortedValues = sortUnder18Values(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const valuesWithOnlyUnder18 = values.filter((item) => item.key === "true");

    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.UNDER18, value);
        } else {
            query.remove(QueryNames.UNDER18, value);
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.UNDER18)}
            className="mb-4"
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span>Under 18 år</span>
                </>
            }
        >
            {valuesWithOnlyUnder18.map((item) => (
                <Checkbox name="under18[]" key={item.key} value={item.key} onChange={handleChange}>
                    {`${labelForUnder18(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

export const labelForUnder18 = (key: string | undefined): string => {
    switch (key) {
        case "true":
            return "Passer for deg under 18 år";
        case "false":
            return "18 år eller over";
        default:
            return key || "";
    }
};

function sortUnder18Values(facets: FilterAggregation[]): FilterAggregation[] {
    if (!facets) {
        return [];
    }
    const sortedPublishedValues = ["true", "false", "Ikke oppgitt"];
    return facets.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));
}
