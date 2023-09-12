import React, { useEffect, useState } from "react";
import { Select } from "@navikt/ds-react";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import EmptyMessage from "../../../common/components/messages/EmptyMessage";
import UserAPI from "../../../common/api/UserAPI";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import FavouritesListItem from "./FavouritesListItem";
import "./Favourites.css";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";

function FavouritesList() {
    const [response, dispatch] = useFetchReducer();
    const [sortBy, setSortBy] = useState("published");

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
     * If user deleted a favourite, remove it from the local data,
     * instead of re-loading all favourites from backend
     */
    function removeFavouriteFromList(removed) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.filter((it) => it.favouriteAd.uuid !== removed.favouriteAd.uuid),
        });
    }

    /**
     *  Fetch favourites when view is shown,
     *  and every time sortBy is changed
     */
    useEffect(() => {
        fetchFavourites();
    }, [sortBy]);

    if (response.status === FetchStatus.NOT_FETCHED || response.status === FetchStatus.IS_FETCHING) {
        return <DelayedSpinner />;
    }
    if (response.status === FetchStatus.FAILURE && response.error.statusCode !== 404) {
        return <ErrorMessage />;
    }
    if (response.status === FetchStatus.SUCCESS && response.data.length === 0) {
        return (
            <EmptyMessage
                title="Ingen favoritter"
                text="Klikk på Lagre favoritt-knappen når du ser en stilling du ønsker å ta vare på."
            />
        );
    }
    return (
        <section className="mb-16">
            <div className="FavouritesList__total-and-sorting mb-12">
                <H1WithAutoFocus size="xlarge" spacing={false}>
                    Favoritter
                </H1WithAutoFocus>
                <Select
                    onChange={(e) => {
                        setSortBy(e.target.value);
                    }}
                    value={sortBy}
                    label="Sorter etter"
                    className="FavouritesList_Sorting"
                >
                    <option key="published" value="published">
                        Vis nyeste øverst
                    </option>
                    <option key="expires" value="expires">
                        Søknadsfrist
                    </option>
                </Select>
            </div>
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

export default FavouritesList;
