import React, { ReactElement } from "react";
import { Select } from "@navikt/ds-react";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

export const SortByValues = {
    RELEVANT: "relevant",
    PUBLISHED: "published",
    EXPIRES: "expires",
};

const DEFAULT_SORT = SortByValues.RELEVANT;

export default function Sorting(): ReactElement {
    const query = useQuery();

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        const { value } = e.target;
        if (value === DEFAULT_SORT) {
            query.remove(QueryNames.SORT);
        } else {
            query.set(QueryNames.SORT, value);
        }
    }

    return (
        <Select
            onChange={handleChange}
            value={query.get(QueryNames.SORT) || SortByValues.RELEVANT}
            label="Sorter etter"
            className="inline-select hide-label-sm"
        >
            <option value={SortByValues.RELEVANT}>Mest relevant</option>
            <option value={SortByValues.PUBLISHED}>Nyeste øverst</option>
            <option value={SortByValues.EXPIRES}>Søknadsfrist</option>
        </Select>
    );
}
