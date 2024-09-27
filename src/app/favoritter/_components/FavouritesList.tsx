"use client";

import React, { useState } from "react";
import { HStack, Select, Heading, VStack } from "@navikt/ds-react";
import * as actions from "@/app/_common/actions";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/_common/hooks/useToggle";
import { SortByEnum } from "@/app/_common/utils/utils"; // Ensure this import is correct
import FavouritesListItem from "./FavouritesListItem";
import NoFavourites from "./NoFavourites";

interface Favourite {
    uuid: string;
    created: string;
    favouriteAd: {
        published: string;
        expires: string;
    };
}

interface FavouritesListProps {
    favourites: Favourite[];
    sortPreference?: keyof typeof SortByEnum;
}

function FavouritesList({ favourites, sortPreference }: FavouritesListProps): JSX.Element {
    const initialSortBy = sortPreference ? SortByEnum[sortPreference] : SortByEnum.FAVOURITE_DATE;
    const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState<string[]>([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();

    let sortedFavourites = [...favourites];

    if (sortBy === SortByEnum.PUBLISHED) {
        sortedFavourites.sort((a, b) => b.favouriteAd.published.localeCompare(a.favouriteAd.published));
    } else if (sortBy === SortByEnum.EXPIRES) {
        sortedFavourites.sort((a, b) => a.favouriteAd.expires.localeCompare(b.favouriteAd.expires));
    } else if (sortBy === SortByEnum.FAVOURITE_DATE) {
        sortedFavourites.sort((a, b) => b.created.localeCompare(a.created));
    }

    sortedFavourites = sortedFavourites.filter((it) => !locallyRemovedUuids.includes(it.uuid));

    function onFavouriteDeleted(uuid: string): void {
        setLocallyRemovedUuids((prev) => [...prev, uuid]);
    }

    if (sortedFavourites.length === 0) {
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
                            const newSortBy = e.target.value as SortByEnum; // Cast to SortByEnum here
                            actions.setUserPreference("favouritesSortBy", newSortBy).then();
                            setSortBy(newSortBy);
                        }}
                        value={sortBy}
                        name="sortBy"
                        label="Sorter etter"
                        className="inline-select"
                    >
                        <option value={SortByEnum.FAVOURITE_DATE}>{SortByEnum.FAVOURITE_DATE}</option>
                        <option value={SortByEnum.EXPIRES}>{SortByEnum.EXPIRES}</option>
                        <option value={SortByEnum.PUBLISHED}>{SortByEnum.PUBLISHED}</option>
                    </Select>
                </HStack>
                <VStack gap="10">
                    {sortedFavourites.map((favourite) => (
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

export default FavouritesList;
