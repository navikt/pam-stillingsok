import React, { useContext, useEffect, useReducer, useState } from "react";
import { ClockIcon, HeartIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import useRouter from "../../../migrating/useRouter";
import Link from "../../../migrating/Link";
import { CONTEXT_PATH } from "../../common/environment";
import queryReducer, { isSearchQueryEmpty, SET_FROM, stringifyQuery, toBrowserQuery } from "../query";
import { extractParam } from "../../common/utils/utils";
import { FetchStatus } from "../../common/hooks/useFetchReducer";
import ErrorMessage from "../../common/components/messages/ErrorMessage";
import SearchForm from "./searchForm/SearchForm";
import "./Search.css";
import SearchResult from "./searchResult/SearchResult";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import DelayedSpinner from "../../common/components/spinner/DelayedSpinner";
import useDevice, { Device } from "../../common/hooks/useDevice";
import FilterForm from "./searchForm/filters/FilterForm";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import { AuthenticationContext, AuthenticationStatus } from "../../common/auth/contexts/AuthenticationProvider";
import LoadingScreen from "../../common/components/loadingScreen/LoadingScreen";
import useToggle from "../../common/hooks/useToggle";
import TermsOfUse from "../../common/user/contexts/TermsOfUse";
import LoginModal from "../../common/auth/components/LoginModal";
import { HasAcceptedTermsStatus, UserContext } from "../../common/user/contexts/UserProvider";
import logAmplitudeEvent from "../../common/tracking/amplitude";

export default function Search({ initialSearchResponse, searchResponse, initialQuery, fetchSearch }) {
    const { authenticationStatus, loginAndRedirect } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [initialRenderDone, setInitialRenderDone] = useState(false);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModalFavorites, openLoginModalFavorites, closeLoginModalFavorites] = useToggle();
    const [shouldShowLoginModalSavedSearch, openLoginModalSavedSearch, closeLoginModalSavedSearch] = useToggle();
    const { device } = useDevice();
    const router = useRouter();

    /**
     * Perform a search when user changes search criteria
     */
    useEffect(() => {
        if (initialRenderDone) {
            const browserQuery = toBrowserQuery(query);

            // Keep saved search uuid in browser url, as long as there are some search criteria.
            // This uuid is used when user update an existing saved search
            const savedSearchUuid = extractParam("saved");
            if (!isSearchQueryEmpty(browserQuery) && savedSearchUuid) {
                browserQuery.saved = savedSearchUuid;
            }

            logAmplitudeEvent("Stillinger - Utførte søk", { query });

            if (fetchSearch) {
                fetchSearch(query);
            }

            try {
                router.replace(CONTEXT_PATH + stringifyQuery(browserQuery), { scroll: false });
            } catch (error) {
                // ignore any errors
            }
        } else {
            // Skip search first time query change, since that
            // will just reload the search result we already got
            setInitialRenderDone(true);
        }
    }, [query]);

    function loadMoreResults() {
        queryDispatch({ type: SET_FROM, value: query.from + query.size });
    }

    function handleClick(e, navigateTo, type) {
        e.preventDefault();
        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && type === "FAVORITES") {
            openLoginModalFavorites();
        } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && type === "SAVEDSEARCH") {
            openLoginModalSavedSearch();
        } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
            openTermsModal();
        } else if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            router.push(navigateTo);
        }
        return false;
    }

    function handleTermsAccepted(navigateTo) {
        closeTermsModal();
        router.push(navigateTo);
    }

    return (
        <div className={isFiltersVisible ? "filter-visible" : "filter-not-visible"}>
            <H1WithAutoFocus className="container-medium  Search__h1" spacing={false}>
                Søk etter din neste jobb
            </H1WithAutoFocus>
            <div className="container-small">
                <SearchForm
                    query={query}
                    dispatchQuery={queryDispatch}
                    fetchSearch={() => {
                        //  fetchSearch();
                    }}
                />
                <div className="Search__buttons">
                    {device === Device.MOBILE && (
                        <Button
                            variant="tertiary"
                            onClick={() => {
                                setIsFiltersVisible(!isFiltersVisible);
                            }}
                            icon={<FilterIcon />}
                            aria-expanded={isFiltersVisible}
                        >
                            Velg sted, yrke og andre filtre
                        </Button>
                    )}
                    {(device === Device.DESKTOP ||
                        (device === Device.MOBILE &&
                            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED)) && (
                        <>
                            <>
                                <Button
                                    as={Link}
                                    to={`${CONTEXT_PATH}/lagrede-sok`}
                                    type="button"
                                    variant="tertiary"
                                    onClick={(e) => {
                                        handleClick(e, `${CONTEXT_PATH}/lagrede-sok`, "SAVEDSEARCH");
                                    }}
                                    icon={<ClockIcon aria-hidden="true" />}
                                >
                                    Bruk et lagret søk
                                </Button>

                                {shouldShowLoginModalSavedSearch && (
                                    <LoginModal
                                        onLoginClick={() => {
                                            loginAndRedirect(`${CONTEXT_PATH}/lagrede-sok`);
                                        }}
                                        onCloseClick={closeLoginModalSavedSearch}
                                    />
                                )}
                            </>
                            <>
                                <Button
                                    as={Link}
                                    to={`${CONTEXT_PATH}/favoritter`}
                                    type="button"
                                    variant="tertiary"
                                    onClick={(e) => {
                                        handleClick(e, `${CONTEXT_PATH}/favoritter`, "FAVORITES");
                                    }}
                                    icon={<HeartIcon aria-hidden="true" />}
                                >
                                    Mine favoritter
                                </Button>

                                {shouldShowLoginModalFavorites && (
                                    <LoginModal
                                        onLoginClick={() => {
                                            loginAndRedirect(`${CONTEXT_PATH}/favoritter`);
                                        }}
                                        onCloseClick={closeLoginModalFavorites}
                                    />
                                )}

                                {shouldShowTermsModal && (
                                    <TermsOfUse
                                        onClose={closeTermsModal}
                                        onTermsAccepted={() => {
                                            handleTermsAccepted(`${CONTEXT_PATH}/favoritter`);
                                        }}
                                    />
                                )}
                            </>
                        </>
                    )}
                </div>
            </div>
            <SearchResultHeader
                isFiltersVisible={isFiltersVisible}
                searchResponse={searchResponse}
                query={query}
                queryDispatch={queryDispatch}
            />
            {(initialSearchResponse.status === FetchStatus.NOT_FETCHED ||
                initialSearchResponse.status === FetchStatus.IS_FETCHING) && <LoadingScreen />}
            {initialSearchResponse.status === FetchStatus.FAILURE && <ErrorMessage />}
            {initialSearchResponse.status === FetchStatus.SUCCESS && (
                <div className="Search__flex container-large">
                    {(device === Device.DESKTOP || (device === Device.MOBILE && isFiltersVisible)) && (
                        <div className="Search__flex-left">
                            <FilterForm
                                query={query}
                                dispatchQuery={queryDispatch}
                                initialSearchResult={initialSearchResponse.data}
                                searchResult={searchResponse.data}
                                fetchSearch={() => {
                                    // fetchSearch();
                                }}
                                isFilterModalOpen={isFiltersVisible}
                                setIsFilterModalOpen={setIsFiltersVisible}
                                device={device}
                            />
                        </div>
                    )}
                    <div className="Search__flex-right">
                        <SelectedFilters query={query} queryDispatch={queryDispatch} />
                        {searchResponse.status === FetchStatus.IS_FETCHING && query.from === 0 ? (
                            <DelayedSpinner />
                        ) : (
                            <>
                                <SearchResult
                                    initialSearchResponse={initialSearchResponse}
                                    searchResponse={searchResponse}
                                    query={query}
                                    queryDispatch={queryDispatch}
                                    loadMoreResults={() => {
                                        loadMoreResults();
                                    }}
                                />
                                <DoYouWantToSaveSearch query={query} />
                                <Feedback query={query} />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
