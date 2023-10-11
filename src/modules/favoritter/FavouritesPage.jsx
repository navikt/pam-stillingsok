import React from "react";
import useDocumentTitle from "../common/hooks/useDocumentTitle";
import useScrollToTop from "../common/hooks/useScrollToTop";
import RequiresAuthentication from "../common/auth/components/RequiresAuthentication";
import RequiresHasAcceptedTerms from "../common/user/components/RequiresHasAcceptedTerms";
import FavouritesList from "./components/FavouritesList";

function FavouritesPage() {
    useDocumentTitle("Favoritter");
    useScrollToTop();

    return (
        <div className="container-medium mt-12 mb-12">
            <RequiresAuthentication>
                <RequiresHasAcceptedTerms>
                    <FavouritesList />
                </RequiresHasAcceptedTerms>
            </RequiresAuthentication>
        </div>
    );
}

export default FavouritesPage;
