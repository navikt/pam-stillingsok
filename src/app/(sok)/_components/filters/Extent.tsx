import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { QueryNames } from "@/app/(sok)/_components/QueryNames";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface ExtentProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Extent({ initialValues, updatedValues }: ExtentProps): ReactElement {
    const values = mergeCount(initialValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.EXTENT, value);
        } else {
            query.remove(QueryNames.EXTENT, value);
        }
        logFilterChanged({ name: "Omfang", value, checked });
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.EXTENT)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">omfang</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="extent[]" key={item.key} value={item.key} onChange={handleChange}>
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
