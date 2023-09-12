import React from "react";
import SavedSearchesList from "./components/SavedSearchesList";
import RequiresAuthentication from "../auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../user/components/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import "./components/SavedSearches.css";

/**
 * Page showing saved searches.
 * If user is not logged in or hasn't accepted user terms
 * a message about this will be shown instead.
 */
function SavedSearchesPage() {
    useDocumentTitle("Lagrede søk");
    useScrollToTop();

    return (
        <div className="container-medium mt-12 mb-16">
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <SavedSearchesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default SavedSearchesPage;
