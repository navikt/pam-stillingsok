import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import moveFilterToBottom from "@/app/stillinger/(sok)/_components/utils/moveFilterToBottom";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { type FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";

interface WorkLanguageProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
    hideLegend?: boolean;
}

export default function WorkLanguage({ initialValues, updatedValues, hideLegend = false }: WorkLanguageProps) {
    const sortedValues = moveFilterToBottom(initialValues, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.WORK_LANGUAGE, value);
        } else {
            query.remove(QueryNames.WORK_LANGUAGE, value);
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.WORK_LANGUAGE)}
            hideLegend={hideLegend}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter arbeidsspråk
                </BodyShort>
            }
        >
            {values.map((item) => (
                <Checkbox name="workLanguage[]" key={item.key} value={item.key} onChange={handleChange}>
                    {`${item.key} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
