import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveFilterToBottom from "@/app/(sok)/_components/utils/moveFilterToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortFiltersAlphabetically from "@/app/(sok)/_components/utils/sortFiltersAlphabetically";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

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
        logFilterChanged({ name: "Sektor", value, checked });
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
