"use client";

import React, { useEffect, useState } from "react";
import { HStack, Select, Heading } from "@navikt/ds-react";
import FavouritesListItem from "./FavouritesListItem";
import LoadingPage from "../../_common/components/LoadingPage";

function FavouritesList() {
    const [favourites, setFavourites] = useState({ status: "not-fetched" });
    const [sortBy, setSortBy] = useState("published");

    const fetchFavourites = async (sortByInput) => {
        setFavourites({ status: "pending" });
        const response = await fetch(`/stillinger/api/v1/userfavouriteads?sort=${sortByInput}`, {
            credentials: "same-origin",
            cache: "no-store",
        });
        if (response.status === 200) {
            const json = await response.json();
            setFavourites({
                status: "success",
                data: json,
            });
        } else {
            setFavourites({ status: "error" });
        }
    };

    useEffect(() => {
        fetchFavourites(sortBy).catch((error) => {
            console.log("Error fetching favourites", error);
        });
    }, []);

    /**
     * If user deleted a favourite, remove it from the local data,
     * instead of re-loading all favourites from backend
     */
    function removeFavouriteFromList(removed) {
        console.log("removeFavouriteFromList", removed);
        // TODO: gjør server kall for å fjerne favoritt
        // dispatch({
        //     type: FetchAction.SET_DATA,
        //     data: (prevState) => prevState.filter((it) => it.favouriteAd.uuid !== removed.favouriteAd.uuid),
        // });
    }

    return (
        <div>
            {favourites.status === "not-fetched" || favourites.status === "pending" ? (
                <LoadingPage />
            ) : (
                <section className="container-medium mt-16 mb-16">
                    <HStack gap="4" align="center" justify="space-between" className="mb-12">
                        <Heading level="1" size="xlarge">
                            Favoritter
                        </Heading>
                        <Select
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                fetchFavourites(e.target.value);
                            }}
                            value={sortBy}
                            label="Sorter etter"
                            className="inline-select"
                        >
                            <option key="published" value="published">
                                Vis nyeste øverst
                            </option>
                            <option key="expires" value="expires">
                                Søknadsfrist
                            </option>
                        </Select>
                    </HStack>
                    <div>
                        {favourites &&
                            favourites.data?.map((favourite) => (
                                <FavouritesListItem
                                    key={favourite.uuid}
                                    favourite={favourite}
                                    removeFavouriteFromList={removeFavouriteFromList}
                                    onRemoved={removeFavouriteFromList}
                                />
                            ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default FavouritesList;
