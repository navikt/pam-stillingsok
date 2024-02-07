import React, { useContext, useEffect, useState } from "react";
import useDocumentTitle from "../../app/_common/hooks/useDocumentTitle";
import { AuthenticationContext, AuthenticationStatus } from "../../app/_common/auth/contexts/AuthenticationProvider";
import LoginIsRequiredPage from "../../app/_common/auth/components/LoginIsRequiredPage";
import { HasAcceptedTermsStatus, UserContext } from "../../app/_common/user/UserProvider";
import UserConsentIsRequired from "../../app/stillinger/favoritter/_components/UserConsentIsRequired";
import { FetchAction, useFetchReducer } from "../../app/_common/hooks/useFetchReducer";
import UserAPI from "../../app/_common/api/UserAPI";
import FavouritesList from "../../app/stillinger/favoritter/_components/FavouritesList";
import NoFavourites from "../../app/stillinger/favoritter/_components/NoFavourites";

/**
 * Page showing users favourites (saved ads).
 * If user is not logged in or hasn't accepted user terms
 * a message about this will be shown instead.
 */
function FavouritesPage() {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [favouritesResponse, dispatch] = useFetchReducer();
    const [sortBy, setSortBy] = useState("published");

    useDocumentTitle("Favoritter");

    function fetchFavourites() {
        dispatch({ type: FetchAction.BEGIN });
        UserAPI.get(
            `api/v1/userfavouriteads?size=999&sort=favouriteAd.${sortBy},${sortBy === "expires" ? "asc" : "desc"}`,
        )
            .then((res) => {
                dispatch({ type: FetchAction.RESOLVE, data: res.content ? res.content : [] });
            })
            .catch((error) => {
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    /**
     *  Fetch favourites when user has logged in and accepted terms,
     *  and every time sortBy is changed
     */
    useEffect(() => {
        if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            fetchFavourites();
        }
    }, [authenticationStatus, hasAcceptedTermsStatus, sortBy]);

    if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
        return <LoginIsRequiredPage onLogin={login} />;
    }

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
        return <UserConsentIsRequired />;
    }

    if (favouritesResponse.data.length === 0) {
        return <NoFavourites />;
    }

    return <FavouritesList data={favouritesResponse.data} dispatch={dispatch} sortBy={sortBy} setSortBy={setSortBy} />;
}

export default FavouritesPage;
