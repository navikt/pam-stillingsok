"use client";

import { BodyShort, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import type React from "react";
import { track } from "@/app/_common/umami";
import type { FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import mergeCount from "@/app/stillinger/(sok)/_components/utils/mergeCount";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type SeasonProps = {
    initialSummerJobValues: FilterAggregation[];
    updatedSummerJobValues: FilterAggregation[];
    initialXmasJobValues: FilterAggregation[];
    updatedXmasJobValues: FilterAggregation[];
    xmasJobFilterVisible: boolean;
};

export default function Season({
    initialSummerJobValues,
    updatedSummerJobValues,
    initialXmasJobValues,
    updatedXmasJobValues,
    xmasJobFilterVisible,
}: SeasonProps) {
    const summerJobCount =
        mergeCount(initialSummerJobValues, updatedSummerJobValues).find((item) => item.key === "true")?.count ?? 0;
    const xmasJobCount =
        mergeCount(initialXmasJobValues, updatedXmasJobValues).find((item) => item.key === "true")?.count ?? 0;

    const query = useQuery();
    const value = [
        ...(query.getAll(QueryNames.IS_SUMMER_JOB).includes("true") ? ["summerJob"] : []),
        ...(query.getAll(QueryNames.IS_XMAS_JOB).includes("true") ? ["xmasJob"] : []),
    ];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const { value: selectedSeason, checked } = e.target;
        let queryName: string;
        let filterGroup: string;

        switch (selectedSeason) {
            case "summerJob":
                queryName = QueryNames.IS_SUMMER_JOB;
                filterGroup = "Sommerjobb";
                break;
            case "xmasJob":
                queryName = QueryNames.IS_XMAS_JOB;
                filterGroup = "Julejobb";
                break;
            default:
                return;
        }

        if (checked) {
            query.set(queryName, "true");
            track("Søk - la til filter", { filterGroup });
        } else {
            query.remove(queryName, "true");
        }
    }

    return (
        <CheckboxGroup
            value={value}
            legend={
                <BodyShort as="span" visuallyHidden>
                    Filtrer etter sesong
                </BodyShort>
            }
        >
            <Checkbox name="isSummerJob" value="summerJob" onChange={handleChange}>
                {`Sommerjobb (${summerJobCount})`}
            </Checkbox>
            {xmasJobFilterVisible && (
                <Checkbox name="isXmasJob" value="xmasJob" onChange={handleChange}>
                    {`Julejobb (${xmasJobCount})`}
                </Checkbox>
            )}
        </CheckboxGroup>
    );
}
