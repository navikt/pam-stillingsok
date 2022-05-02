import React, { useEffect, useState } from "react";
import SearchResultItem from "../search/searchResultItem/SearchResultItem";
import { Select } from "nav-frontend-skjema";
import { captureException } from "@sentry/browser";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import ErrorMessage from "../../components/messages/ErrorMessage";
import EmptyMessage from "../../components/messages/EmptyMessage";
import UserAPI from "../../api/UserAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../hooks/useFetchReducer";

function FavouritesList() {
    const [response, dispatch] = useFetchReducer();
    const [sortBy, setSortBy] = useState("published");

    /**
     *  Fetch favourites when view is shown,
     *  and every time sortBy is changed
     */
    useEffect(() => {
        fetchFavourites();
    }, [sortBy]);

    function fetchFavourites() {
        dispatch({ type: FetchAction.BEGIN });
        UserAPI.get(
            `api/v1/userfavouriteads?size=999&sort=favouriteAd.${sortBy},${sortBy === "expires" ? "asc" : "desc"}`
        )
            .then((response) => {
                dispatch({ type: FetchAction.RESOLVE, data: response.content ? response.content : [] });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    /**
     * If user deleted a favourite, remove it from the local data,
     * instead of re-loading all favourites from backend
     */
    function removeFavouriteFromList(removed) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.filter((it) => it.favouriteAd.uuid !== removed.favouriteAd.uuid)
        });
    }

    if (response.status === FetchStatus.NOT_FETCHED || response.status === FetchStatus.IS_FETCHING) {
        return <DelayedSpinner />;
    } else if (response.status === FetchStatus.FAILURE && response.error.statusCode !== 404) {
        return <ErrorMessage />;
    } else if (response.status === FetchStatus.SUCCESS && response.data.length === 0) {
        return (
            <EmptyMessage
                title="Ingen favoritter"
                text="Klikk på favorittstjernen eller Lagre favoritt-knappen når du ser en stilling du ønsker å ta vare på."
            />
        );
    } else {
        return (
            <section>
                <header className="FavouritesList__total-and-sorting">
                    <h2 className="Favourites__h2">
                        {response.data.length !== 1 ? `${response.data.length} annonser` : "1 annonse"}
                    </h2>
                    <Select
                        onChange={(e) => {
                            setSortBy(e.target.value);
                        }}
                        value={sortBy}
                        label="Sortér etter"
                        className="FavouritesList_Sorting"
                    >
                        <option key="published" value="published">
                            Vis nyeste øverst
                        </option>
                        <option key="expires" value="expires">
                            Søknadsfrist
                        </option>
                    </Select>
                </header>
                {response.data.map((favourite) => (
                    <SearchResultItem
                        key={favourite.uuid}
                        ad={{
                            uuid: favourite.favouriteAd.uuid,
                            title: favourite.favouriteAd.title,
                            published: favourite.favouriteAd.published,
                            source: favourite.favouriteAd.source,
                            reference: favourite.favouriteAd.reference,
                            properties: {
                                employer: favourite.favouriteAd.employer,
                                jobtitle: favourite.favouriteAd.jobTitle,
                                location: favourite.favouriteAd.location,
                                applicationdue: favourite.favouriteAd.applicationdue
                            }
                        }}
                        showExpired={favourite.favouriteAd.status !== "ACTIVE"}
                        onFavouriteRemoved={removeFavouriteFromList}
                        shouldConfirmFavouriteDelete={true}
                    />
                ))}
            </section>
        );
    }
}

export default FavouritesList;
