import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import moveFilterToBottom from "@/app/(sok)/_components/utils/moveFilterToBottom";
import { WORK_LANGUAGE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface WorkLanguageProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
    hideLegend?: boolean;
}

export default function WorkLanguage({
    initialValues,
    updatedValues,
    hideLegend = false,
}: WorkLanguageProps): ReactElement {
    const sortedValues = moveFilterToBottom(initialValues, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(WORK_LANGUAGE, value);
        } else {
            searchQuery.remove(WORK_LANGUAGE, value);
        }
        logFilterChanged({ name: "Arbeidsspråk", value, checked });
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(WORK_LANGUAGE)}
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
