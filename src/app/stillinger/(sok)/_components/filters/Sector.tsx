import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/stillinger/(sok)/_components/utils/moveFilterToBottom";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import sortFiltersAlphabetically from "@/app/stillinger/(sok)/_components/utils/sortFiltersAlphabetically";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/stillinger/_common/_types/FilterAggregations";

interface SectorProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Sector({ initialValues, updatedValues }: SectorProps): ReactElement {
    const sortedValuesByFirstLetter = sortFiltersAlphabetically(initialValues);
    const sortedValues = moveFilterToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.SECTOR, value);
        } else {
            query.remove(QueryNames.SECTOR, value);
        }
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={query.getAll(QueryNames.SECTOR)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">sektor</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="sector[]" key={item.key} value={item.key} onChange={handleChange}>
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
