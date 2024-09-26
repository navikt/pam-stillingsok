import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/(sok)/_components/utils/moveFilterToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortRemoteValues from "@/app/(sok)/_components/utils/sortRemoteValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { REMOTE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface RemoteProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Remote({ initialValues, updatedValues }: RemoteProps): ReactElement {
    const sortedValuesByFirstLetter = sortRemoteValues(initialValues);
    const sortedValues = moveFilterToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

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
            searchQuery.append(REMOTE, value);
        } else {
            searchQuery.remove(REMOTE, value);
        }
        logFilterChanged({ name: "Hjemmekontor", value: labelForRemote(value), checked });
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(REMOTE)}
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
