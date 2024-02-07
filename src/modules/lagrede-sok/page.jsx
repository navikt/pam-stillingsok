import React, { useContext, useEffect } from "react";
import SavedSearchesList from "../../app/stillinger/lagrede-sok/_components/SavedSearchesList";
import useDocumentTitle from "../../app/stillinger/_common/hooks/useDocumentTitle";
import useScrollToTop from "../../app/stillinger/_common/hooks/useScrollToTop";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "../../app/stillinger/_common/auth/contexts/AuthenticationProvider";
import Loading from "../loading";
import Error from "../error";
import LoginIsRequiredPage from "../../app/stillinger/_common/auth/components/LoginIsRequiredPage";
import { HasAcceptedTermsStatus, UserContext } from "../../app/stillinger/_common/user/UserProvider";
import UserConsentIsRequired from "../../app/stillinger/lagrede-sok/_components/UserConsentIsRequired";
import { FetchAction, FetchStatus, useFetchReducer } from "../../app/stillinger/_common/hooks/useFetchReducer";
import UserAPI from "../../app/stillinger/_common/api/UserAPI";
import { extractParam } from "../../app/stillinger/_common/utils/utils";
import NoSavedSearches from "../../app/stillinger/lagrede-sok/_components/NoSavedSearches";

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
        return <UserConsentIsRequired />;
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

    if (savedSearchResponse.data.length === 0) {
        return <NoSavedSearches />;
    }

    return <SavedSearchesList data={savedSearchResponse.data} dispatch={dispatch} uuid={uuidFromBrowserUrl} />;
}

export default SavedSearchesPage;
