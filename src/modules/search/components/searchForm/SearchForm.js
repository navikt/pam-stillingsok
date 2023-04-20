import React, { useContext, useState } from "react";
import { Accordion, Button, Heading } from "@navikt/ds-react";
import Counties from "./filters/Locations";
import EngagementType from "./filters/Engagement";
import Extent from "./filters/Extent";
import Occupations from "./filters/Occupations";
import Published from "./filters/Published";
import Sector from "./filters/Sector";
import SearchBox from "./SearchBox";
import FilterModal from "./filters/FilterModal";
import { toBrowserQuery } from "../../query";
import { ChevronDownIcon, ClockIcon, TrashIcon } from "@navikt/aksel-icons";
import Sorting from "./filters/Sorting";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../../../common/environment";
import { AuthenticationContext, AuthenticationStatus } from "../../../auth/contexts/AuthenticationProvider";

const SearchForm = ({ fetchSearch, query, dispatchQuery, initialSearchResult, searchResult }) => {
    const [isLocationsVisible, setIsLocationsVisible] = useState(false);
    const [isOccupationsVisible, setIsOccupationsVisible] = useState(false);
    const [isOtherVisible, setIsOtherVisible] = useState(false);
    const { authenticationStatus } = useContext(AuthenticationContext);

    /**
     * Handles form submit. This is typically triggered if
     * user presses enter-key in the search box.
     */
    function submitForm(e) {
        e.preventDefault();
        fetchSearch();
    }

    const numberOfSelectedFilters = Object.keys(toBrowserQuery(query)).length;
    const numberOfHits = searchResult && searchResult.totalAds ? searchResult.totalAds : 0;

    return (
        <form id="sok" className="mb-2" onSubmit={submitForm} role="search">
            <SearchBox query={query} dispatch={dispatchQuery} />

            <div className="Search__filter-buttons">
                <Button
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                        setIsLocationsVisible(true);
                    }}
                    icon={<ChevronDownIcon aria-hidden="true" />}
                >
                    Sted
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                        setIsOccupationsVisible(true);
                    }}
                    icon={<ChevronDownIcon aria-hidden="true" />}
                >
                    Yrke
                </Button>
                <Button
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                        setIsOtherVisible(true);
                    }}
                    icon={<ChevronDownIcon aria-hidden="true" />}
                >
                    Mer
                </Button>
                {numberOfSelectedFilters > 0 && (
                    <Button
                        type="button"
                        variant="tertiary"
                        onClick={() => {
                            dispatchQuery({ type: "RESET" });
                        }}
                        icon={<TrashIcon aria-hidden="true" />}
                    >
                        Tøm filter ({numberOfSelectedFilters})
                    </Button>
                )}
                {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                    <Button
                        as={Link}
                        to={`${CONTEXT_PATH}/lagrede-sok`}
                        type="button"
                        variant="tertiary"
                        onClick={() => {
                            setIsOtherVisible(true);
                        }}
                        icon={<ClockIcon aria-hidden="true" />}
                    >
                        Mine søk
                    </Button>
                )}
            </div>

            {isLocationsVisible && (
                <FilterModal
                    numberOfHits={numberOfHits}
                    onCloseClick={() => {
                        setIsLocationsVisible(false);
                    }}
                    title="Filter på sted"
                >
                    <Counties
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult}
                        updatedValues={searchResult}
                    />
                </FilterModal>
            )}

            {isOccupationsVisible && (
                <FilterModal
                    numberOfHits={numberOfHits}
                    onCloseClick={() => setIsOccupationsVisible(false)}
                    title="Filter på yrke"
                >
                    <Occupations
                        query={query}
                        dispatch={dispatchQuery}
                        initialValues={initialSearchResult.aggregations.occupationFirstLevels}
                        updatedValues={searchResult && searchResult.aggregations.occupationFirstLevels}
                    />
                </FilterModal>
            )}

            {isOtherVisible && (
                <FilterModal
                    numberOfHits={numberOfHits}
                    onCloseClick={() => setIsOtherVisible(false)}
                    title="Andre filter"
                >
                    <div className="FilterModal__flex-columns">
                        <div className="FilterModal__column">
                            <Published
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={initialSearchResult.aggregations.published}
                                updatedValues={searchResult && searchResult.aggregations.published}
                            />
                            <Sorting dispatch={dispatchQuery} query={query} />
                        </div>
                        <div className="FilterModal__column">
                            <EngagementType
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={initialSearchResult.aggregations.engagementTypes}
                                updatedValues={searchResult && searchResult.aggregations.engagementTypes}
                            />
                        </div>
                        <div className="FilterModal__column">
                            <Extent
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={initialSearchResult.aggregations.extent}
                                updatedValues={searchResult && searchResult.aggregations.extent}
                            />
                            <Sector
                                query={query}
                                dispatch={dispatchQuery}
                                initialValues={initialSearchResult.aggregations.sector}
                                updatedValues={searchResult && searchResult.aggregations.sector}
                            />
                        </div>
                    </div>
                </FilterModal>
            )}
        </form>
    );
};

export default SearchForm;
