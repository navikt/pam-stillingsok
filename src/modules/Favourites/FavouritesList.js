import React, { useEffect, useState } from "react";
import { captureException } from "@sentry/browser";
import DelayedSpinner from "../../components/DelayedSpinner/DelayedSpinner";
import ErrorMessage from "../../components/Messages/ErrorMessage";
import EmptyMessage from "../../components/Messages/EmptyMessage";
import UserAPI from "../../api/UserAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../hooks/useFetchReducer";
import FavouritesListItem from "./FavouritesListItem";
import { Select } from "@navikt/ds-react";

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
                text="Klikk på Lagre favoritt-knappen når du ser en stilling du ønsker å ta vare på."
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
                        hideLabel={true}
                    >
                        <option key="published" value="published">
                            Vis nyeste øverst
                        </option>
                        <option key="expires" value="expires">
                            Søknadsfrist
                        </option>
                    </Select>
                </header>
                <div>
                    {response.data.map((favourite) => (
                        <FavouritesListItem
                            key={favourite.uuid}
                            favourite={favourite}
                            removeFavouriteFromList={removeFavouriteFromList}
                            onRemoved={removeFavouriteFromList}
                        />
                    ))}
                </div>
            </section>
        );
    }
}

export default FavouritesList;
