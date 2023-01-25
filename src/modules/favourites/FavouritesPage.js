import React from "react";
import { CONTEXT_PATH } from "../../environment";
import FavouritesList from "./components/FavouritesList";
import RequiresAuthentication from "../auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../user/components/RequiresHasAcceptedTerms";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useTrackPageview from "../../common/hooks/useTrackPageview";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import BackLink from "../../common/components/backlink/BackLink";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import "./components/Favourites.less";

function FavouritesPage() {
    const title = "Favoritter";

    useDocumentTitle(title);
    useTrackPageview(`${CONTEXT_PATH}/favoritter`, title);
    useScrollToTop();

    return (
        <div className="Favourites">
            <BackLink to={CONTEXT_PATH} text="Ledige stillinger" />
            <H1WithAutoFocus className="Favourites__h1">{title}</H1WithAutoFocus>
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default FavouritesPage;
