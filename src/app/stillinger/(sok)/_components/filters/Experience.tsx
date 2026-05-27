import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import { labelForExperience } from "@/app/stillinger/(sok)/_components/filters/filterLabelUtils";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface ExperienceProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Experience({ initialValues, updatedValues }: ExperienceProps) {
    const sortedValues = sortExperienceValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.EXPERIENCE, value);
        } else {
            query.remove(QueryNames.EXPERIENCE, value);
        }
    }

    return (
        <CheckboxGroup
            className="mb-4"
            value={query.getAll(QueryNames.EXPERIENCE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">erfaring</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox key={item.key} name="experience[]" value={item.key} onChange={handleChange}>
                    {`${labelForExperience(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

function sortExperienceValues(facets: FilterAggregation[]): FilterAggregation[] {
    if (!facets) {
        return [];
    }
    const sortedPublishedValues = ["Ingen", "Noe", "Mye", "Ikke oppgitt"];
    return facets.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));
}
