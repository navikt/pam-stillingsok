import React from "react";
import { Select } from "@navikt/ds-react";
import useSearchQuery from "@/app/(sok)/_components/SearchStateProvider";
import { SORT } from "@/app/(sok)/_components/searchParamNames";

function Sorting() {
    const searchQuery = useSearchQuery();
    function handleChange(e) {
        const { value } = e.target;
        searchQuery.set(SORT, value);
    }

    return (
        <Select
            onChange={handleChange}
            value={searchQuery.get(SORT) || "published"}
            label="Sorter etter"
            className="inline-select"
        >
            <option key="published" value="published">
                Nyeste øverst
            </option>
            <option key="relevant" value="relevant">
                Mest relevant
            </option>
            <option key="expires" value="expires">
                Søknadsfrist
            </option>
        </Select>
    );
}

export default Sorting;
