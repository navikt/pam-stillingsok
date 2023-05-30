import React from "react";
import { Heading } from "@navikt/ds-react";
import { formatNumber } from "../../../../../common/components/utils";
import { Device } from "../../../../../common/hooks/useDevice";
import Filters from "./Filters";
import FilterModal from "./FilterModal";

const FilterForm = ({
    isFilterModalOpen,
    setIsFilterModalOpen,
    fetchSearch,
    query,
    dispatchQuery,
    initialSearchResult,
    searchResult,
    device
}) => {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    const form = (
        <form id="filter" onSubmit={submitForm}>
            <Filters
                query={query}
                dispatchQuery={dispatchQuery}
                initialSearchResult={initialSearchResult}
                searchResult={searchResult}
            />
        </form>
    );

    if (device === Device.MOBILE && isFilterModalOpen) {
        return (
            <FilterModal title="Filtre" searchResult={searchResult} onCloseClick={() => setIsFilterModalOpen(false)}>
                {form}
            </FilterModal>
        );
    } else if (device === Device.DESKTOP) {
        return (
            <div>
                <Heading level="2" size="medium" spacing>
                    Filtre
                </Heading>
                {form}
            </div>
        );
    }
    return null;
};

export default FilterForm;
