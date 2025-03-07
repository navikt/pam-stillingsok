import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import moveFilterToBottom from "@/app/stillinger/(sok)/_components/utils/moveFilterToBottom";
import sortEducationsFiltersByLevel from "@/app/stillinger/(sok)/_components/utils/sortEducationsFiltersByLevel";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/stillinger/_common/_types/FilterAggregations";

interface EducationProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Education({ initialValues, updatedValues }: EducationProps): ReactElement {
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
            className="mb-4"
            value={query.getAll(QueryNames.EDUCATION)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">utdanning</span>
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

export const labelForEducation = (key: string): string => {
    switch (key) {
        case "Ingen krav":
            return "Ingen krav til utdanning";
        case "Master":
            return "Master eller tilsvarende";
        case "Videregående":
            return "Videregående skole";
        case "Fagbrev":
            return "Fag- eller svennebrev";
        case "Fagskole":
            return "Fagskole eller tilsvarende";
        case "Bachelor":
            return "Bachelor eller tilsvarende";
        default:
            return key;
    }
};
