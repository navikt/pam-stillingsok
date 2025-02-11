import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface DriversLicenseProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function DriversLicense({ initialValues, updatedValues }: DriversLicenseProps): ReactElement {
    const sortedValues = sortDriverLicenseValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.NEED_DRIVERS_LICENSE, value);
        } else {
            query.remove(QueryNames.NEED_DRIVERS_LICENSE, value);
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.NEED_DRIVERS_LICENSE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">førerkort</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name="needDriversLicense[]" key={item.key} value={item.key} onChange={handleChange}>
                    {`${labelForNeedDriversLicense(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

export const labelForNeedDriversLicense = (key: string): string => {
    switch (key) {
        case "true":
            return "Må ha førerkort";
        case "false":
            return "Trenger ikke førerkort";
        default:
            return key;
    }
};

function sortDriverLicenseValues(facets: FilterAggregation[]): FilterAggregation[] {
    if (!facets) {
        return [];
    }
    const sortedPublishedValues = ["false", "true", "Ikke oppgitt"];
    return facets.sort((a, b) => sortedPublishedValues.indexOf(a.key) - sortedPublishedValues.indexOf(b.key));
}
