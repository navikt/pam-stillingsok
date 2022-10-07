import React, { useContext } from "react";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../Authentication/AuthenticationProvider";
import { UserContext } from "../User/UserProvider";
import SavedSearchesList from "./SavedSearchesList";
import RequiresAuthentication from "../Authentication/RequiresAuthentication";
import RequiresUserConsent from "../User/RequiresUserConsent";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import useScrollToTop from "../../hooks/useScrollToTop";
import H1WithAutoFocus from "../../components/H1WithAutoFocus/H1WithAutoFocus";
import BackLink from "../../components/BackLink/BackLink";
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
        <div className="SavedSearches">
            <BackLink to={CONTEXT_PATH} text="Ledige stillinger" />
            <H1WithAutoFocus className="SavedSearches__h1">{title}</H1WithAutoFocus>
            <RequiresAuthentication authenticationStatus={authenticationStatus} login={login}>
                <RequiresUserConsent hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <SavedSearchesList />
                </RequiresUserConsent>
            </RequiresAuthentication>
        </div>
    );
}

export default SavedSearches;
