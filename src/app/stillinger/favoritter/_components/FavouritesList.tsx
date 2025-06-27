"use client";

import React, { useState } from "react";
import { HStack, Select, Heading, VStack, Search } from "@navikt/ds-react";
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

    const [searchTerm, setSearchTerm] = useState("");

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

    const onSearchClear = () => {
        setSearchTerm("");
    };

    return (
        <div>
            <section className="container-medium mt-10 mb-24">
                <HStack gap="4" justify="center" className="mb-12">
                    <Heading level="1" size="xlarge">
                        Favoritter
                    </Heading>
                </HStack>
                <HStack gap="6" align="center" justify="start" className="mb-12">
                    <Select
                        onChange={(e) => {
                            const newSortBy = e.target.value as SortByEnum; // Cast to SortByEnum here
                            actions.setUserPreference("favouritesSortBy", newSortBy).then();
                            setSortBy(newSortBy);
                        }}
                        value={sortBy}
                        name="sortBy"
                        label="Sorter etter"
                    >
                        <option value={SortByEnumValues.FAVOURITE_DATE}>Nyeste favoritter</option>
                        <option value={SortByEnumValues.EXPIRES}>Søknadsfrist</option>
                        <option value={SortByEnumValues.PUBLISHED}>Publiseringsdato</option>
                    </Select>
                    <form role="search">
                        <Search
                            name="q"
                            variant="simple"
                            hideLabel={false}
                            label="Søk blant favoritter"
                            placeholder="Søk på tittel, sted eller bedrift"
                            onClear={onSearchClear}
                            value={searchTerm}
                            onChange={(value) => {
                                setSearchTerm(value);
                            }}
                            autoComplete="off"
                        />
                    </form>
                </HStack>
                <VStack gap="10">
                    {sortedFavourites.map((favourite) => (
                        <>
                            {(favourite.favouriteAd.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
                                favourite.favouriteAd.location.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
                                favourite.favouriteAd.employer.toLowerCase().search(searchTerm.toLowerCase()) !==
                                    -1) && (
                                <FavouritesListItem
                                    key={favourite.uuid}
                                    favourite={favourite as Favourite}
                                    onFavouriteDeleted={onFavouriteDeleted}
                                    openErrorDialog={openErrorDialog}
                                />
                            )}
                        </>
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
