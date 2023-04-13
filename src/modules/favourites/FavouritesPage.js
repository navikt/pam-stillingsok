import React from "react";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import RequiresAuthentication from "../auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../user/components/RequiresHasAcceptedTerms";
import FavouritesList from "./components/FavouritesList";

function FavouritesPage() {
    useDocumentTitle("Favoritter");
    useScrollToTop();

    return (
        <div className="Favourites">
            <H1WithAutoFocus>Favoritter</H1WithAutoFocus>
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default FavouritesPage;
