"use client";

import React, { FormEvent, useState } from "react";
import { HStack, Select, Heading, VStack, Search, Button, Switch } from "@navikt/ds-react";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import { SortByEnumValues, SortValue, FilterByEnumValues, FilterValue } from "@/app/stillinger/_common/utils/utilsts";
import FavouritesListItem from "./FavouritesListItem";
import NoFavourites from "./NoFavourites";
import { FavorittStilling } from "@/app/stillinger/_common/types/Favorite";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery, { QueryProvider } from "@/app/stillinger/(sok)/_components/QueryProvider";
import { TrashIcon } from "@navikt/aksel-icons";

interface Favourite {
    uuid: string;
    created: string;
    favouriteAd: FavorittStilling;
}
export interface FavouritesListProps {
    favourites: Favourite[];
    sortPreference?: SortValue;
    filterPreference?: FilterValue;
}

function FavouritesList({ favourites, sortPreference, filterPreference }: FavouritesListProps): JSX.Element {
    const initialSortBy = sortPreference ? sortPreference : SortByEnumValues.FAVOURITE_DATE;
    const initialFilterBy = filterPreference ? filterPreference : FilterByEnumValues.UNEXPIRED;
    const [sortBy, setSortBy] = useState<SortValue>(initialSortBy);
    const [filterBy, setFilterBy] = useState<FilterValue>(initialFilterBy);
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState<string[]>([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();
    const query = useQuery();
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

    const onSearchFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const resetSearch = () => {
        window.scrollTo(0, 0);
        setSearchTerm("");
    };

    sortedFavourites = sortedFavourites.filter(
        (favourite) =>
            favourite.favouriteAd.title.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
            favourite.favouriteAd.location.toLowerCase().search(searchTerm.toLowerCase()) !== -1 ||
            favourite.favouriteAd.employer.toLowerCase().search(searchTerm.toLowerCase()) !== -1,
    );

    if (filterBy === FilterByEnumValues.EXPIRED) {
        sortedFavourites = sortedFavourites.filter((favourite) => favourite.favouriteAd.status !== "ACTIVE");
    } else {
        sortedFavourites = sortedFavourites.filter((favourite) => favourite.favouriteAd.status === "ACTIVE");
    }

    const onExpiredFilterChange = () => {
        if (filterBy === FilterByEnumValues.UNEXPIRED) {
            query.set(QueryNames.FILTER, FilterByEnumValues.EXPIRED);
            setFilterBy(FilterByEnumValues.EXPIRED);
        } else {
            query.set(QueryNames.FILTER, FilterByEnumValues.UNEXPIRED);
            setFilterBy(FilterByEnumValues.UNEXPIRED);
        }
    };

    return (
        <QueryProvider>
            <section className="container-medium mt-10 mb-24">
                <HStack gap="4" justify="center" className="mb-12">
                    <Heading level="1" size="xlarge">
                        Favoritter
                    </Heading>
                </HStack>
                <HStack gap="6" align="end" justify="start" className="mb-12">
                    <Select
                        className="select-width"
                        onChange={(e) => {
                            const newSortBy = e.target.value as SortValue;
                            query.set(QueryNames.SORT, `${newSortBy}`);
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
                    <form role="search" onSubmit={onSearchFormSubmit} className="search-width">
                        <Search
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
                    <Switch checked={filterBy === FilterByEnumValues.EXPIRED} onChange={() => onExpiredFilterChange()}>
                        Vis utløpte annonser
                    </Switch>
                </HStack>
                <VStack gap="10">
                    {sortedFavourites.length > 0 ? (
                        sortedFavourites.map((favourite) => (
                            <FavouritesListItem
                                key={favourite.uuid}
                                favourite={favourite as Favourite}
                                onFavouriteDeleted={onFavouriteDeleted}
                                openErrorDialog={openErrorDialog}
                            />
                        ))
                    ) : searchTerm ? (
                        <Heading level="2" size="medium" className="text-center">
                            Ingen treff
                        </Heading>
                    ) : (
                        sortedFavourites.length === 0 && (
                            <Heading level="2" size="medium" className="text-center">
                                Ingen annonser
                            </Heading>
                        )
                    )}
                </VStack>
                {searchTerm && (
                    <HStack justify="center" className={sortedFavourites.length !== 0 ? "mt-18" : "mt-6"}>
                        <Button
                            variant="tertiary"
                            onClick={() => resetSearch()}
                            icon={<TrashIcon aria-hidden="true" />}
                        >
                            Nullstill søk
                        </Button>
                    </HStack>
                )}

                {shouldShowErrorDialog && (
                    <AlertModalWithPageReload id="favourites-list-item-error" onClose={closeErrorDialog} title="Feil">
                        Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                    </AlertModalWithPageReload>
                )}
            </section>
        </QueryProvider>
    );
}

export default FavouritesList;
