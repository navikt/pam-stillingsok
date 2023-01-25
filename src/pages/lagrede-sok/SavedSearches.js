import React, {useContext} from "react";
import {CONTEXT_PATH} from "../../environment";
import {AuthenticationContext} from "../../common/context/AuthenticationProvider";
import {UserContext} from "../../common/context/UserProvider";
import SavedSearchesList from "./SavedSearchesList";
import RequiresAuthentication from "../../common/components/wrappers/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../../common/components/wrappers/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useTrackPageview from "../../common/hooks/useTrackPageview";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import BackLink from "../../common/components/backlink/BackLink";
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
                <RequiresHasAcceptedTerms hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <SavedSearchesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default SavedSearches;
