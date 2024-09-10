import React from "react";
import { Select } from "@navikt/ds-react";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { SORT } from "@/app/(sok)/_components/searchParamNames";

export const SortByValues = {
    RELEVANT: "relevant",
    PUBLISHED: "published",
    EXPIRES: "expires",
};

function Sorting() {
    const searchQuery = useSearchQuery();
    function handleChange(e) {
        const { value } = e.target;
        searchQuery.set(SORT, value);
    }

    return (
        <Select
            onChange={handleChange}
            value={searchQuery.get(SORT) || SortByValues.PUBLISHED}
            label="Sorter etter"
            className="inline-select hide-label-sm"
        >
            <option value={SortByValues.PUBLISHED}>Nyeste øverst</option>
            <option value={SortByValues.RELEVANT}>Mest relevant</option>
            <option value={SortByValues.EXPIRES}>Søknadsfrist</option>
        </Select>
    );
}

export default Sorting;
