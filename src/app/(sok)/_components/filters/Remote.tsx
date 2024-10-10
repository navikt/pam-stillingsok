import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/(sok)/_components/utils/moveFilterToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortRemoteFilters from "@/app/(sok)/_components/utils/sortRemoteFilters";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { QueryNames } from "@/app/(sok)/_components/QueryNames";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface RemoteProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Remote({ initialValues, updatedValues }: RemoteProps): ReactElement {
    const sortedValuesByFirstLetter = sortRemoteFilters(initialValues);
    const sortedValues = moveFilterToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function labelForRemote(label: string): string {
        switch (label) {
            case "Hybridkontor":
                return "Hybridkontor";
            case "Hjemmekontor":
                return "Kun hjemmekontor";
            default:
                return label;
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.REMOTE, value);
        } else {
            query.remove(QueryNames.REMOTE, value);
        }
        logFilterChanged({ name: "Hjemmekontor", value: labelForRemote(value), checked });
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.REMOTE)}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter hjemmekontor
                </BodyShort>
            }
        >
            {values.map((item) => (
                <Checkbox name="remote[]" key={item.key} value={item.key} onChange={handleChange}>
                    {`${labelForRemote(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
