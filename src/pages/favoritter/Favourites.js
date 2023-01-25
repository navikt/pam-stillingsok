import React, { useContext } from "react";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../../context/AuthenticationProvider";
import { UserContext } from "../../context/UserProvider";
import FavouritesList from "./FavouritesList";
import RequiresAuthentication from "../../components/wrappers/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../../components/wrappers/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import useScrollToTop from "../../hooks/useScrollToTop";
import BackLink from "../../components/backlink/BackLink";
import H1WithAutoFocus from "../../components/h1WithAutoFocus/H1WithAutoFocus";
import "./Favourites.less";

function Favourites() {
    const title = "Favoritter";
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/favoritter`, title);
    useScrollToTop();

    return (
        <div className="Favourites">
            <BackLink to={CONTEXT_PATH} text="Ledige stillinger" />
            <H1WithAutoFocus className="Favourites__h1">{title}</H1WithAutoFocus>
            <RequiresAuthentication authenticationStatus={authenticationStatus} login={login}>
                <RequiresHasAcceptedTerms hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default Favourites;
