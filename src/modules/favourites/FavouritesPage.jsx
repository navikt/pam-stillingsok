import React from "react";
import useDocumentTitle from "../../common/hooks/useDocumentTitle";
import useScrollToTop from "../../common/hooks/useScrollToTop";
import RequiresAuthentication from "../auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../user/components/RequiresHasAcceptedTerms";
import FavouritesList from "./components/FavouritesList";

function FavouritesPage() {
    useDocumentTitle("Favoritter");
    useScrollToTop();

    return (
        <div className="container-medium mt-3 mb-3">
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default FavouritesPage;
