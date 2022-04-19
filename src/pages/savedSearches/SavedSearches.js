import React, { useContext } from "react";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../../context/AuthenticationProvider";
import { UserContext } from "../../context/UserProvider";
import { useScrollToTop, useTrackPageview } from "../../hooks";
import PageHeader from "../../components/pageHeader/PageHeader";
import SavedSearchesList from "./SavedSearchesList";
import RequiresAuthentication from "../../components/wrappers/RequiresAuthentication";
import RequiresUser from "../../components/wrappers/RequiresUser";
import "./SavedSearches.less";
import useDocumentTitle from "../../hooks/useDocumentTitle";

function SavedSearches() {
    const title = "Lagrede søk";
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/lagrede-sok`, title);
    useScrollToTop();

    return (
        <React.Fragment>
            <PageHeader title={title} />
            <RequiresAuthentication authenticationStatus={authenticationStatus} login={login}>
                <RequiresUser hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <SavedSearchesList />
                </RequiresUser>
            </RequiresAuthentication>
        </React.Fragment>
    );
}

export default SavedSearches;
