import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import { labelForEducation } from "@/app/stillinger/(sok)/_components/filters/filterLabelUtils";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import moveFilterToBottom from "@/app/stillinger/(sok)/_components/utils/moveFilterToBottom";
import sortEducationsFiltersByLevel from "@/app/stillinger/(sok)/_components/utils/sortEducationsFiltersByLevel";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface EducationProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Education({ initialValues, updatedValues }: EducationProps) {
    const sortedValuesByEducation = sortEducationsFiltersByLevel(initialValues);
    const sortedValues = moveFilterToBottom(sortedValuesByEducation, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.EDUCATION, value);
        } else {
            query.remove(QueryNames.EDUCATION, value);
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.EDUCATION)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span>Krav til utdanning</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox key={item.key} name="education[]" value={item.key} onChange={handleChange}>
                    {`${labelForEducation(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
