import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { EXPERIENCE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface ExperienceProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Experience({ initialValues, updatedValues }: ExperienceProps): ReactElement {
    const sortedValues = sortExperienceValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(EXPERIENCE, value);
        } else {
            searchQuery.remove(EXPERIENCE, value);
        }
        logFilterChanged({ name: "Erfaring", value, checked });
    }

    return (
        <CheckboxGroup
            className="mb-4"
            value={searchQuery.getAll(EXPERIENCE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter erfaring
                    </BodyShort>
                    <span className="capitalize">Erfaring</span>
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

export const labelForExperience = (key: string): string => {
    switch (key) {
        case "Ingen":
            return "Ingen krav til arbeidserfaring";
        case "Noe":
            return "Noe arbeidserfaring (1-3år)";
        case "Mye":
            return "Mye arbeidserfaring (4år+)";
        default:
            return key;
    }
};

function sortExperienceValues(facets: FilterAggregation[]): FilterAggregation[] {
    if (!facets) {
        return [];
    }
    const sortedPublishedValues = ["Ingen", "Noe", "Mye", "Ikke oppgitt"];
    return facets.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));
}
