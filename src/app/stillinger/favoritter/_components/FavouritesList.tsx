"use client";

import React, { useState } from "react";
import { HStack, Select, Heading, VStack } from "@navikt/ds-react";
import * as actions from "@/app/stillinger/_common/actions";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import { SortByEnum, SortByEnumValues } from "@/app/stillinger/_common/utils/utilsts";
import FavouritesListItem from "./FavouritesListItem";
import NoFavourites from "./NoFavourites";
import { FavorittStilling } from "@/app/stillinger/_common/types/Favorite";

interface Favourite {
    uuid: string;
    created: string;
    favouriteAd: FavorittStilling;
}
interface FavouritesListProps {
    favourites: Favourite[];
    sortPreference?: keyof typeof SortByEnumValues;
}

function FavouritesList({ favourites, sortPreference }: FavouritesListProps): JSX.Element {
    const initialSortBy = sortPreference ? SortByEnumValues[sortPreference] : SortByEnumValues.FAVOURITE_DATE;
    const [sortBy, setSortBy] = useState<SortByEnum>(initialSortBy);
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState<string[]>([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();

    let sortedFavourites = [...favourites];

    if (sortBy === SortByEnumValues.PUBLISHED) {
        sortedFavourites.sort((a, b) => b.favouriteAd.published.localeCompare(a.favouriteAd.published));
    } else if (sortBy === SortByEnumValues.EXPIRES) {
        sortedFavourites.sort((a, b) => a.favouriteAd.expires.localeCompare(b.favouriteAd.expires));
    } else if (sortBy === SortByEnumValues.FAVOURITE_DATE) {
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
                        <option value={SortByEnumValues.FAVOURITE_DATE}>Lagt til dato</option>
                        <option value={SortByEnumValues.EXPIRES}>Utgår</option>
                        <option value={SortByEnumValues.PUBLISHED}>Publisert</option>
                    </Select>
                </HStack>
                <VStack gap="10">
                    {sortedFavourites.map((favourite) => (
                        <FavouritesListItem
                            key={favourite.uuid}
                            favourite={favourite as Favourite}
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
