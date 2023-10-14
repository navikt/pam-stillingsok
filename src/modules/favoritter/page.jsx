import React, { useContext, useEffect, useState } from "react";
import useDocumentTitle from "../common/hooks/useDocumentTitle";
import useScrollToTop from "../common/hooks/useScrollToTop";
import { AuthenticationContext, AuthenticationStatus } from "../common/auth/contexts/AuthenticationProvider";
import Loading from "../loading";
import Error from "../error";
import LoginIsRequired from "../common/auth/LoginIsRequired";
import { HasAcceptedTermsStatus, UserContext } from "../common/user/contexts/UserProvider";
import UserConsentIsRequired from "./components/UserConsentIsRequired";
import { FetchAction, FetchStatus, useFetchReducer } from "../common/hooks/useFetchReducer";
import UserAPI from "../common/api/UserAPI";
import FavouritesList from "./components/FavouritesList";
import NoFavourites from "./components/NoFavourites";

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
    useScrollToTop();

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
        return <LoginIsRequired onLogin={login} />;
    }

    if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
        return <UserConsentIsRequired />;
    }

    if (
        authenticationStatus === AuthenticationStatus.NOT_FETCHED ||
        authenticationStatus === AuthenticationStatus.IS_FETCHING ||
        hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_FETCHED ||
        favouritesResponse.status === FetchStatus.NOT_FETCHED ||
        favouritesResponse.status === FetchStatus.IS_FETCHING
    ) {
        return <Loading />;
    }

    if (authenticationStatus === AuthenticationStatus.FAILURE || favouritesResponse.status === FetchStatus.FAILURE) {
        return <Error />;
    }

    if (favouritesResponse.data.length === 0) {
        return <NoFavourites />;
    }

    return <FavouritesList data={favouritesResponse.data} dispatch={dispatch} sortBy={sortBy} setSortBy={setSortBy} />;
}

export default FavouritesPage;
