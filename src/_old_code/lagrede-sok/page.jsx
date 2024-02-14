/**
import React, { useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SavedSearchesList from "../../app/lagrede-sok/_components/SavedSearchesList";
import { AuthenticationContext, AuthenticationStatus } from "../../app/_common/auth/contexts/AuthenticationProvider";
import LoginIsRequiredPage from "../../app/_common/auth/components/LoginIsRequiredPage";
import { HasAcceptedTermsStatus, UserContext } from "../../app/_common/user/UserProvider";
import UserConsentIsRequired from "../../app/lagrede-sok/_components/UserConsentIsRequired";
import { FetchAction, useFetchReducer } from "../../app/_common/hooks/useFetchReducer";
import UserAPI from "../../app/_common/user/UserAPI";
import NoSavedSearches from "../../app/lagrede-sok/_components/NoSavedSearches";

 * Page showing saved searches.
 * If user is not logged in or hasn't accepted user terms
 * a message about this will be shown instead.
function SavedSearchesPage() {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [savedSearchResponse, dispatch] = useFetchReducer();

    const searchParams = useSearchParams();
    const uuidFromBrowserUrl = searchParams.get("uuid");

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

     * Fetch saved searches when user has logged in and accepted terms
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

    if (savedSearchResponse.data.length === 0) {
        return <NoSavedSearches />;
    }

    return <SavedSearchesList data={savedSearchResponse.data} dispatch={dispatch} uuid={uuidFromBrowserUrl} />;
}

export default SavedSearchesPage;
*/
