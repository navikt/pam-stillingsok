"use client";

import React, { useState } from "react";
import { HStack, Select, Heading, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import * as actions from "@/app/_common/actions";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/_common/hooks/useToggle";
import { SortByEnum } from "@/app/_common/utils/utils";
import FavouritesListItem from "./FavouritesListItem";
import NoFavourites from "./NoFavourites";

function FavouritesList({ favourites, sortPreference }) {
    const [sortBy, setSortBy] = useState(sortPreference || SortByEnum.FAVOURITE_DATE);
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();

    if (sortBy === SortByEnum.PUBLISHED) {
        favourites.sort((a, b) => b.favouriteAd.published.localeCompare(a.favouriteAd.published));
    } else if (sortBy === SortByEnum.EXPIRES) {
        favourites.sort((a, b) => a.favouriteAd.expires.localeCompare(b.favouriteAd.expires));
    } else if (sortBy === SortByEnum.FAVOURITE_DATE) {
        favourites.sort((a, b) => b.created.localeCompare(a.created));
    }

    // eslint-disable-next-line
    favourites = favourites.filter((it) => !locallyRemovedUuids.includes(it.uuid));

    function onFavouriteDeleted(uuid) {
        setLocallyRemovedUuids([...locallyRemovedUuids, uuid]);
    }

    if (favourites.length === 0) {
        return <NoFavourites />;
    }

    return (
        <div>
            <section className="container-medium mt-10 mb-24">
                <HStack gap="4" align="center" justify="space-between" className="mb-12">
                    <Heading level="1" size="xlarge">
                        Favoritter
                    </Heading>
                    <Select
                        onChange={(e) => {
                            actions.setUserPreference("favouritesSortBy", e.target.value);
                            setSortBy(e.target.value);
                        }}
                        value={sortBy}
                        name="sortBy"
                        label="Sorter etter"
                        className="inline-select"
                    >
                        <option key={SortByEnum.FAVOURITE_DATE} value={SortByEnum.FAVOURITE_DATE}>
                            Sist lagt til
                        </option>
                        <option key={SortByEnum.PUBLISHED} value={SortByEnum.PUBLISHED}>
                            Vis nyeste øverst
                        </option>
                        <option key={SortByEnum.EXPIRES} value={SortByEnum.EXPIRES}>
                            Søknadsfrist
                        </option>
                    </Select>
                </HStack>
                <VStack gap="10">
                    {favourites &&
                        favourites.map((favourite) => (
                            <FavouritesListItem
                                key={favourite.uuid}
                                favourite={favourite}
                                onFavouriteDeleted={onFavouriteDeleted}
                                openErrorDialog={openErrorDialog}
                            />
                        ))}
                </VStack>

                {shouldShowErrorDialog && (
                    <AlertModalWithPageReload id="favourites-list-item-error" onClose={closeErrorDialog} title="Feil">
                        Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                    </AlertModalWithPageReload>
                )}
            </section>
        </div>
    );
}

FavouritesList.propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortPreference: PropTypes.string,
};

export default FavouritesList;
