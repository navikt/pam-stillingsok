import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(nonce)/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/(nonce)/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/(nonce)/stillinger/(sok)/_components/QueryProvider";
import { type FilterAggregation } from "@/app/(nonce)/stillinger/_common/types/FilterAggregations";

interface ExperienceProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function Experience({ initialValues, updatedValues }: ExperienceProps): ReactElement {
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
