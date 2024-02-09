"use client";

import React, { useRef } from "react";
import { HStack, Select, Heading } from "@navikt/ds-react";
import FavouritesListItem from "./FavouritesListItem";
import PropTypes from "prop-types";

function FavouritesList({ favourites, sortBy }) {
    const formRef = useRef(null);

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
        <form ref={formRef}>
            <section className="container-medium mt-16 mb-16">
                <HStack gap="4" align="center" justify="space-between" className="mb-12">
                    <Heading level="1" size="xlarge">
                        Favoritter
                    </Heading>
                    <Select
                        onChange={(e) => {
                            formRef.current.submit();
                        }}
                        value={sortBy}
                        name="sortBy"
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
                        favourites.map((favourite) => (
                            <FavouritesListItem
                                key={favourite.uuid}
                                favourite={favourite}
                                removeFavouriteFromList={removeFavouriteFromList}
                                onRemoved={removeFavouriteFromList}
                            />
                        ))}
                </div>
            </section>
        </form>
    );
}

FavouritesList.propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortBy: PropTypes.string.isRequired,
};

export default FavouritesList;
