import React from "react";
import useDocumentTitle from "../common/hooks/useDocumentTitle";
import useScrollToTop from "../common/hooks/useScrollToTop";
import BackLink from "../common/components/backlink/BackLink";
import {CONTEXT_PATH} from "../common/environment";
import H1WithAutoFocus from "../common/components/h1WithAutoFocus/H1WithAutoFocus";
import RequiresAuthentication from "../modules/auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../modules/user/components/RequiresHasAcceptedTerms";
import FavouritesList from "../modules/favourites/components/FavouritesList";

function FavouritesPage() {
    useDocumentTitle("Favoritter");
    useScrollToTop();

    return (
        <div className="Favourites">
            <BackLink to={CONTEXT_PATH} text="Ledige stillinger" />
            <H1WithAutoFocus className="Favourites__h1">
                Favoritter
            </H1WithAutoFocus>
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default FavouritesPage;
