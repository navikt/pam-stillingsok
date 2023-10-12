import React, { useContext, useEffect } from "react";
import SavedSearchesList from "./components/SavedSearchesList";
import useDocumentTitle from "../common/hooks/useDocumentTitle";
import useScrollToTop from "../common/hooks/useScrollToTop";
import "./components/SavedSearches.css";
import { AuthenticationContext, AuthenticationStatus } from "../common/auth/contexts/AuthenticationProvider";
import Loading from "../loading";
import Error from "../error";
import LoginIsRequiredPage from "../common/auth/LoginIsRequiredPage";
import { HasAcceptedTermsStatus, UserContext } from "../common/user/contexts/UserProvider";
import UserConsentIsRequiredPage from "../common/user/UserConsentIsRequiredPage";
import { FetchAction, FetchStatus, useFetchReducer } from "../common/hooks/useFetchReducer";
import UserAPI from "../common/api/UserAPI";
import { extractParam } from "../common/utils/utils";

/**
 * Page showing saved searches.
 * If user is not logged in or hasn't accepted user terms
 * a message about this will be shown instead.
 */
function SavedSearchesPage() {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [savedSearchResponse, dispatch] = useFetchReducer();
    const uuidFromBrowserUrl = extractParam("uuid");

    useDocumentTitle("Lagrede søk");
    useScrollToTop();

    function fetchSavedSearches() {
        dispatch({ type: FetchAction.BEGIN });

        UserAPI.get("api/v1/savedsearches?size=999&sort=updated,desc")
            .then((response) => {
                dispatch({ type: FetchAction.RESOLVE, data: response.content ? response.content : [] });
            })
            .catch((err) => {
                dispatch({ type: FetchAction.REJECT, error: err });
            });
    }

    /**
     * Fetch saved searches when user has logged in and accepted terms
     */
    useEffect(() => {
        if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            fetchSavedSearches();
        }
    }, [authenticationStatus, hasAcceptedTermsStatus]);

    if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
        return <LoginIsRequiredPage onLogin={login} />;
    }

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
        return <UserConsentIsRequiredPage />;
    }

    if (
        authenticationStatus === AuthenticationStatus.NOT_FETCHED ||
        authenticationStatus === AuthenticationStatus.IS_FETCHING ||
        hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_FETCHED ||
        savedSearchResponse.status === FetchStatus.NOT_FETCHED ||
        savedSearchResponse.status === FetchStatus.IS_FETCHING
    ) {
        return <Loading />;
    }

    if (authenticationStatus === AuthenticationStatus.FAILURE || savedSearchResponse.status === FetchStatus.FAILURE) {
        return <Error />;
    }

    return <SavedSearchesList data={savedSearchResponse.data} dispatch={dispatch} uuid={uuidFromBrowserUrl} />;
}

export default SavedSearchesPage;
