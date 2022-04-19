import React, { useContext } from "react";
import PageHeader from "../../components/pageHeader/PageHeader";
import { CONTEXT_PATH } from "../../environment";
import { useDocumentTitle, useScrollToTop, useTrackPageview } from "../../hooks";
import { AuthenticationContext } from "../../context/AuthenticationProvider";
import { UserContext } from "../../context/UserProvider";
import FavouritesList from "./FavouritesList";
import RequiresAuthentication from "../../components/wrappers/RequiresAuthentication";
import RequiresUser from "../../components/wrappers/RequiresUser";
import "./Favourites.less";

function Favourites() {
    const title = "Favoritter";
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);

    useDocumentTitle(`${title} - Arbeidsplassen`);
    useTrackPageview(`${CONTEXT_PATH}/favoritter`, title);
    useScrollToTop();

    return (
        <React.Fragment>
            <PageHeader title={title} />
            <RequiresAuthentication authenticationStatus={authenticationStatus} login={login}>
                <RequiresUser hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <FavouritesList />
                </RequiresUser>
            </RequiresAuthentication>
        </React.Fragment>
    );
}

export default Favourites;
