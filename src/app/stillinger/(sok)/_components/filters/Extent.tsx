import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { type FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";

interface ExtentProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Extent({ initialValues, updatedValues }: ExtentProps) {
    const values = mergeCount(initialValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.EXTENT, value);
        } else {
            query.remove(QueryNames.EXTENT, value);
        }
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
