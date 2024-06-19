import React from "react";
import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import moveCriteriaToBottom from "@/app/(sok)/_components/utils/moveFacetToBottom";
import mergeCount from "@/app/(sok)/_components/utils/mergeCount";
import sortRemoteValues from "@/app/(sok)/_components/utils/sortRemoteValues";
import { logFilterChanged } from "@/app/_common/monitoring/amplitude";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function Remote({ initialValues, updatedValues }) {
    const sortedValuesByFirstLetter = sortRemoteValues(initialValues);
    const sortedValues = moveCriteriaToBottom(sortedValuesByFirstLetter, "Ikke oppgitt");
    const values = mergeCount(sortedValues, updatedValues);
    const router = useSearchRouter();
    const searchParams = useSearchParams();

    function labelForRemote(label) {
        switch (label) {
            case "Hybridkontor":
                return "Hybridkontor";
            case "Hjemmekontor":
                return "Kun hjemmekontor";
            default:
                return label;
        }
    }

    function handleClick(e) {
        const { value, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);

        if (checked) {
            newSearchParams.append(SearchQueryParams.REMOTE, value);
        } else {
            newSearchParams.delete(SearchQueryParams.REMOTE, value);
        }
        router.replace(newSearchParams, { scroll: false });
        logFilterChanged({ name: "Hjemmekontor", value: labelForRemote(value), checked });
    }

    return (
        <CheckboxGroup
            className="mt-4"
            value={searchParams.getAll(SearchQueryParams.REMOTE)}
            legend={
                <>
                    <BodyShort as="span" visuallyHidden>
                        Filtrer etter{" "}
                    </BodyShort>
                    <span className="capitalize">hjemmekontor</span>
                </>
            }
        >
            {values.map((item) => (
                <Checkbox name={SearchQueryParams.REMOTE} key={item.key} value={item.key} onChange={handleClick}>
                    {`${labelForRemote(item.key)} (${item.count})`}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}

export default Remote;
