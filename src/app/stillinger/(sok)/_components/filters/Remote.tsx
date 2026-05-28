import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import moveFilterToBottom from "@/app/stillinger/(sok)/_components/utils/moveFilterToBottom";
import sortRemoteFilters from "@/app/stillinger/(sok)/_components/utils/sortRemoteFilters";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface RemoteProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Remote({ initialValues, updatedValues }: RemoteProps) {
    const sortedValuesByFirstLetter = sortRemoteFilters(initialValues);
    const sortedValues = moveFilterToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.REMOTE, value);
        } else {
            query.remove(QueryNames.REMOTE, value);
        }
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
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
