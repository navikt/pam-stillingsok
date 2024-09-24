import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import sortEducationValues from "@/app/(sok)/_components/utils/sortEducationValues";
import { EDUCATION } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface EducationProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Education({ initialValues, updatedValues }: EducationProps): ReactElement {
    const sortedValuesByEducation = sortEducationValues(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByEducation, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(EDUCATION, value);
        } else {
            searchQuery.remove(EDUCATION, value);
        }
        logFilterChanged({ name: "Utdanningsnivå", value, checked });
    }

    return (
        <CheckboxGroup
            className="mb-4"
            value={searchQuery.getAll(EDUCATION)}
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
