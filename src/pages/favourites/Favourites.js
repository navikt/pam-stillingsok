import React, { useContext } from "react";
import PageHeader from "../../components/pageHeader/PageHeader";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../../context/AuthenticationProvider";
import { UserContext } from "../../context/UserProvider";
import FavouritesList from "./FavouritesList";
import RequiresAuthentication from "../../components/wrappers/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../../components/wrappers/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import useScrollToTop from "../../hooks/useScrollToTop";
import "./Favourites.less";
import useAutoFocusOnPageChange from "../../hooks/useAutoFocusOnPageChange";

function Favourites() {
    const title = "Favoritter";
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const autoFocusOnPageChangeRef = useAutoFocusOnPageChange();

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/favoritter`, title);
    useScrollToTop();

    return (
        <React.Fragment>
            <PageHeader title={title} h1Ref={autoFocusOnPageChangeRef} />
            <RequiresAuthentication authenticationStatus={authenticationStatus} login={login}>
                <RequiresHasAcceptedTerms hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </React.Fragment>
    );
}

export default Favourites;
