import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import { labelForSummerJob } from "@/app/stillinger/(sok)/_components/filters/filterLabelUtils";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface SummerJobProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function SummerJob({ initialValues, updatedValues }: SummerJobProps) {
    const values = mergeCount(initialValues, updatedValues);
    const valuesWithOnlySummerJob = values.filter((item) => item.key === "true");

    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.IS_SUMMER_JOB, value);
        } else {
            query.remove(QueryNames.IS_SUMMER_JOB, value);
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.IS_SUMMER_JOB)}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter sommerjobb
                </BodyShort>
            }
        >
            {valuesWithOnlySummerJob.map((item) => (
                <Checkbox name="isSummerJob" key={item.key} value={item.key} onChange={handleChange}>
                    {`${labelForSummerJob(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
