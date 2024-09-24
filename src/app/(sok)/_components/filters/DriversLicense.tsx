import React, { ReactElement } from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { NEED_DRIVERS_LICENSE } from "@/app/(sok)/_components/searchParamNames";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";

interface DriversLicenseProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function DriversLicense({ initialValues, updatedValues }: DriversLicenseProps): ReactElement {
    const sortedValues = sortDriverLicenseValues(initialValues);
    const values = mergeCount(sortedValues, updatedValues);
    const searchQuery = useSearchQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            searchQuery.append(NEED_DRIVERS_LICENSE, value);
        } else {
            searchQuery.remove(NEED_DRIVERS_LICENSE, value);
        }
        logFilterChanged({ name: "Førerkort", value, checked });
    }

    return (
        <CheckboxGroup
            value={searchQuery.getAll(NEED_DRIVERS_LICENSE)}
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
