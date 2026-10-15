import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import { track } from "@/app/_common/umami";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import { labelForHasSuperraskSoknad } from "@/app/stillinger/(sok)/_components/filters/filterLabelUtils";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface HasSuperraskSoknadProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function HasSuperraskSoknad({ initialValues, updatedValues }: HasSuperraskSoknadProps) {
    const values = mergeCount(initialValues, updatedValues);
    const valuesWithOnlySuperrask = values.filter((item) => item.key === "true");

    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value, checked } = e.target;
        if (checked) {
            query.append(QueryNames.HAS_SUPERRASK_SOKNAD, value);
        } else {
            query.remove(QueryNames.HAS_SUPERRASK_SOKNAD, value);
        }

        if (checked) {
            track("Søk - la til filter", {
                filterGroup: "Superrask søknad",
            });
        }
    }

    return (
        <CheckboxGroup
            value={query.getAll(QueryNames.HAS_SUPERRASK_SOKNAD)}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter superrask søknad
                </BodyShort>
            }
        >
            {valuesWithOnlySuperrask.map((item) => (
                <Checkbox name="hasSuperraskSoknad" key={item.key} value={item.key} onChange={handleChange}>
                    {`${labelForHasSuperraskSoknad(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
