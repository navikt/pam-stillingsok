import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import { track } from "@/app/_common/umami";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

interface SuperraskSoknadProps {
    initialValues: FilterAggregation[];
    updatedValues: FilterAggregation[];
}

export default function SuperraskSoknad({ initialValues, updatedValues }: SuperraskSoknadProps) {
    const query = useQuery();

    const count =
        mergeCount(initialValues, updatedValues).find((item) => item.key === "true")?.count ??
        updatedValues.find((item) => item.key === "true")?.count;

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
            <Checkbox name="hasSuperraskSoknad" value="true" onChange={handleChange}>
                {`Superrask søknad (${count})`}
            </Checkbox>
        </CheckboxGroup>
    );
}
