import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import { track } from "@/app/_common/umami";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

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

        if (checked) {
            track("Søk - la til filter", {
                filterGroup: "Heltid/deltid",
            });
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.EXTENT)}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter heltid/deltid
                </BodyShort>
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
