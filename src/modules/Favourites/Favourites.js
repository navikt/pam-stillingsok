import React, { useContext } from "react";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../Authentication/AuthenticationProvider";
import { UserContext } from "../User/UserProvider";
import FavouritesList from "./FavouritesList";
import RequiresAuthentication from "../Authentication/RequiresAuthentication";
import RequiresUserConsent from "../User/RequiresUserConsent";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import useScrollToTop from "../../hooks/useScrollToTop";
import BackLink from "../../components/BackLink/BackLink";
import H1WithAutoFocus from "../../components/H1WithAutoFocus/H1WithAutoFocus";
import "./Favourites.css";

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
                <RequiresUserConsent hasAcceptedTermsStatus={hasAcceptedTermsStatus}>
                    <FavouritesList />
                </RequiresUserConsent>
            </RequiresAuthentication>
        </div>
    );
}

export default Favourites;
