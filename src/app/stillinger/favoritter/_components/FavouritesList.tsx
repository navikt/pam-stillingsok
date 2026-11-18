"use client";

import { BodyShort, Heading, HStack, Search, Select, Switch, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import DebouncedLiveRegion from "@/app/stillinger/favoritter/_components/DebouncedLiveRegion";
import { byDate } from "@/app/stillinger/favoritter/_components/utils";
import type { FavouriteInternal } from "@/app/stillinger/favoritter/types/FavouriteInternal";
import FavouritesListItem from "./FavouritesListItem";
import {
    DEFAULT_FAVOURITE_FILTER,
    DEFAULT_FAVOURITE_SORT,
    FAVOURITE_FILTER_PARAM,
    FAVOURITE_SORT_PARAM,
    FilterByEnumValues,
    type FilterValue,
    SortByEnumValues,
    type SortValue,
} from "./favouritePreferences";
import { createFavouriteSearch } from "./favouriteSearch";
import NoFavourites from "./NoFavourites";

export type FavouritesListProps = {
    favourites: FavouriteInternal[];
    sortPreference?: SortValue;
    filterPreference?: FilterValue;
};

function replaceFavouriteParam(key: typeof FAVOURITE_FILTER_PARAM | typeof FAVOURITE_SORT_PARAM, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState(null, "", url);
}

function FavouritesList({ favourites, sortPreference, filterPreference }: FavouritesListProps) {
    const [sortBy, setSortBy] = useState<SortValue>(sortPreference ?? DEFAULT_FAVOURITE_SORT);
    const [filterBy, setFilterBy] = useState<FilterValue>(filterPreference ?? DEFAULT_FAVOURITE_FILTER);
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState<string[]>([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();
    const [searchTerm, setSearchTerm] = useState("");
    const onFavouriteDeleted = useCallback((uuid: string): void => {
        setLocallyRemovedUuids((prev) => [...prev, uuid]);
    }, []);

    const onSearchClear = useCallback(() => setSearchTerm(""), []);
    const onSearchChange = useCallback((value: string) => setSearchTerm(value), []);

    const onSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortBy = e.target.value as SortValue;
        setSortBy(newSortBy);
        replaceFavouriteParam(FAVOURITE_SORT_PARAM, newSortBy);
    }, []);

    const onExpiredFilterChange = useCallback(() => {
        const next =
            filterBy === FilterByEnumValues.UNEXPIRED ? FilterByEnumValues.EXPIRED : FilterByEnumValues.UNEXPIRED;
        setFilterBy(next);
        replaceFavouriteParam(FAVOURITE_FILTER_PARAM, next);
    }, [filterBy]);

    const search = useMemo(() => createFavouriteSearch(searchTerm), [searchTerm]);
    const sortedAndFiltered = useMemo<readonly FavouriteInternal[]>(() => {
        const base = favourites.filter((f) => !locallyRemovedUuids.includes(f.uuid));

        const afterFilter =
            filterBy === FilterByEnumValues.EXPIRED
                ? base.filter((f) => f.favouriteAd.status !== "ACTIVE")
                : base.filter((f) => f.favouriteAd.status === "ACTIVE");

        const afterSearch = afterFilter.filter((f) =>
            search.matches({
                title: f.favouriteAd.title,
                employer: f.favouriteAd.employer,
                location: f.favouriteAd.location,
            }),
        );

        const compare =
            sortBy === SortByEnumValues.PUBLISHED
                ? byDate<FavouriteInternal>((x) => x.favouriteAd.published, "desc")
                : sortBy === SortByEnumValues.EXPIRES
                  ? byDate<FavouriteInternal>((x) => x.favouriteAd.expires, "asc")
                  : byDate<FavouriteInternal>((x) => x.created, "desc");

        afterSearch.sort(compare);
        return afterSearch;
    }, [favourites, locallyRemovedUuids, search, filterBy, sortBy]);

    const count = sortedAndFiltered.length;
    const message =
        search.active && count > 0
            ? `${formatNumber(count)} treff`
            : search.active
              ? "Ingen treff"
              : count === 0
                ? "Ingen annonser"
                : count === 1
                  ? `${formatNumber(count)} annonse`
                  : `${formatNumber(count)} annonser`;

    const hasInitialFavourites = favourites.length > 0;

    if (!hasInitialFavourites) {
        return <NoFavourites />;
    }

    return (
        <PageBlock as="section" width="lg" gutters className="mt-5">
            <Heading level="1" size="xlarge" align="center" className="mb-12">
                Favoritter
            </Heading>
            <HStack gap="space-24" align="end" justify="start" className="mb-12">
                <Select
                    className="select-width"
                    onChange={onSortChange}
                    value={sortBy}
                    name="sortBy"
                    label="Sorter etter"
                >
                    <option value={SortByEnumValues.FAVOURITE_DATE}>Nyeste favoritter</option>
                    <option value={SortByEnumValues.EXPIRES}>Søknadsfrist</option>
                    <option value={SortByEnumValues.PUBLISHED}>Publiseringsdato</option>
                </Select>
                <div className="search-width">
                    <Search
                        id="search"
                        variant="simple"
                        hideLabel={false}
                        label="Søk blant favoritter"
                        placeholder="Søk på tittel, sted eller bedrift"
                        onClear={onSearchClear}
                        value={searchTerm}
                        onChange={onSearchChange}
                        autoComplete="off"
                    />
                </div>
                <Switch checked={filterBy === FilterByEnumValues.EXPIRED} onChange={onExpiredFilterChange}>
                    Vis utløpte annonser
                </Switch>
            </HStack>
            {search.active && count > 0 && <BodyShort>{message}</BodyShort>}
            <VStack gap="space-40">
                {sortedAndFiltered.length > 0 ? (
                    sortedAndFiltered.map((favourite) => (
                        <FavouritesListItem
                            key={favourite.uuid}
                            favourite={{ favouriteAd: favourite.favouriteAd, uuid: favourite.uuid }}
                            onFavouriteDeleted={onFavouriteDeleted}
                            openErrorDialog={openErrorDialog}
                        />
                    ))
                ) : search.active ? (
                    <>
                        <Heading level="2" size="medium" className="text-center">
                            Ingen treff
                        </Heading>
                        <BodyShort className="text-center">
                            {filterBy === FilterByEnumValues.EXPIRED
                                ? "Søket ga ingen treff blant utløpte annonser. Endre søket eller vis aktive annonser."
                                : "Søket ga ingen treff blant aktive annonser. Endre søket eller vis utløpte annonser."}
                        </BodyShort>
                    </>
                ) : (
                    sortedAndFiltered.length === 0 && (
                        <Heading level="2" size="medium" className="text-center">
                            Ingen annonser
                        </Heading>
                    )
                )}
                <DebouncedLiveRegion message={message} />
            </VStack>

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-list-item-error" onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </AlertModalWithPageReload>
            )}
        </PageBlock>
    );
}

export default FavouritesList;
