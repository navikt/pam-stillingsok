import React from "react";
import { Select } from "@navikt/ds-react";
import { useSearchParams } from "next/navigation";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import useSearchRouter from "@/app/(sok)/_utils/useSearchRouter";

function Sorting() {
    const searchParams = useSearchParams();
    const router = useSearchRouter();

    function handleChange(e) {
        const { value } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(SearchQueryParams.SORT, value);
        router.replace(newSearchParams, { scroll: false });
    }

    return (
        <Select
            onChange={handleChange}
            value={searchParams.get(SearchQueryParams.SORT) || "published"}
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
