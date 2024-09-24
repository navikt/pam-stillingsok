import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { EXTENT } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface ExtentProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Extent({ initialValues, updatedValues }: ExtentProps): ReactElement {
    const values = mergeCount(initialValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(EXTENT, value);
        } else {
            searchQuery.remove(EXTENT, value);
        }
        logFilterChanged({ name: "Omfang", value, checked });
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(EXTENT)}
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
