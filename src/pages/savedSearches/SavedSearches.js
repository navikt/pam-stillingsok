import React, { useContext } from "react";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../../context/AuthenticationProvider";
import { UserContext } from "../../context/UserProvider";
import PageHeader from "../../components/pageHeader/PageHeader";
import SavedSearchesList from "./SavedSearchesList";
import RequiresAuthentication from "../../components/wrappers/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../../components/wrappers/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import useScrollToTop from "../../hooks/useScrollToTop";
import "./SavedSearches.less";

/**
 * Page showing saved searches.
 * If user is not logged in or hasn't accepted user terms
 * a message about this will be shown instead.
 */
function SavedSearches() {
    const title = "Lagrede søk";
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/lagrede-sok`, title);
    useScrollToTop();

    return (
        <React.Fragment>
            <PageHeader title={title} shouldAutofocus={true} />
            <RequiresAuthentication authenticationStatus={authenticationStatus} login={login}>
                <RequiresHasAcceptedTerms hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <SavedSearchesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </React.Fragment>
    );
}

export default SavedSearches;
