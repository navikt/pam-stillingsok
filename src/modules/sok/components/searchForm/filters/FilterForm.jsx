import React from "react";
import PropTypes from "prop-types";
import { Device } from "../../../../common/hooks/useDevice";
import Filters from "./Filters";
import FilterModal from "./FilterModal";

function FilterForm({
    isFilterModalOpen,
    setIsFilterModalOpen,
    fetchSearch,
    query,
    dispatchQuery,
    initialSearchResult,
    searchResult,
    device,
}) {
    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    const form = (
        <form id="filter" aria-label="Søkefiltre" onSubmit={submitForm}>
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
    }
    if (device === Device.DESKTOP) {
        return <div>{form}</div>;
    }
    return null;
}

FilterForm.propTypes = {
    isFilterModalOpen: PropTypes.bool,
    setIsFilterModalOpen: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
    dispatchQuery: PropTypes.func,
    initialSearchResult: PropTypes.shape({}),
    searchResult: PropTypes.shape({}),
    device: PropTypes.string,
};

export default FilterForm;
