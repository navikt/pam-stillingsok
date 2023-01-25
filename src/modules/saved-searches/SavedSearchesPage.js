import React from "react";
import {CONTEXT_PATH} from "../../common/environment";
import SavedSearchesList from "./components/SavedSearchesList";
import RequiresAuthentication from "../auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../user/components/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import BackLink from "../../common/components/backlink/BackLink";
import "./components/SavedSearches.less";

/**
 * Page showing saved searches.
 * If user is not logged in or hasn't accepted user terms
 * a message about this will be shown instead.
 */
function SavedSearchesPage() {
    useDocumentTitle("Lagrede søk");
    useScrollToTop();

    return (
        <div className="SavedSearches">
            <BackLink to={CONTEXT_PATH} text="Ledige stillinger" />
            <H1WithAutoFocus className="SavedSearches__h1">
                Lagrede søk
            </H1WithAutoFocus>
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <SavedSearchesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default SavedSearchesPage;
