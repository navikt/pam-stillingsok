import React, { useContext } from "react";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext } from "../../common/context/AuthenticationProvider";
import { UserContext } from "../../common/context/UserProvider";
import FavouritesList from "./FavouritesList";
import RequiresAuthentication from "../../common/components/wrappers/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../../common/components/wrappers/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useTrackPageview from "../../common/hooks/useTrackPageview";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import BackLink from "../../common/components/backlink/BackLink";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
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
