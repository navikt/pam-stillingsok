"use client";

import React, { useCallback, useMemo, useState } from "react";
import { HStack, Select, Heading, VStack, Search, Button, Switch } from "@navikt/ds-react";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import { SortByEnumValues, SortValue, FilterValue } from "@/app/stillinger/_common/utils/utilsts";
import FavouritesListItem from "./FavouritesListItem";
import NoFavourites from "./NoFavourites";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { TrashIcon } from "@navikt/aksel-icons";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import { FilterByEnumValues } from "@/app/stillinger/_common/utils/filter-constants";
import { byDate } from "@/app/stillinger/favoritter/_components/utils";
import DebouncedLiveRegion from "@/app/stillinger/favoritter/_components/DebouncedLiveRegion";
import { Favourite } from "@/app/stillinger/_common/types/Favorite";
import { PageBlock } from "@navikt/ds-react/Page";

interface FavouriteInternal {
    uuid: string;
    created: string;
    favouriteAd: Favourite;
}
export interface FavouritesListProps {
    favourites: FavouriteInternal[];
    sortPreference?: SortValue;
    filterPreference?: FilterValue;
}
const toLower = (s: string | null | undefined): string => (s ?? "").toLocaleLowerCase();
const matchesSearch = (fav: FavouriteInternal, needle: string): boolean => {
    if (!needle) return true;
    const n = needle.toLocaleLowerCase();
    const title = toLower(fav.favouriteAd.title);
    const employer = toLower(fav.favouriteAd.employer);
    const location = toLower(fav.favouriteAd.location);
    return title.includes(n) || employer.includes(n) || location.includes(n);
};
function FavouritesList({ favourites, sortPreference, filterPreference }: FavouritesListProps) {
    const [sortBy, setSortBy] = useState<SortValue>(sortPreference ?? SortByEnumValues.FAVOURITE_DATE);
    const [filterBy, setFilterBy] = useState<FilterValue>(filterPreference ?? FilterByEnumValues.UNEXPIRED);
    const [locallyRemovedUuids, setLocallyRemovedUuids] = useState<string[]>([]);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle();
    const [searchTerm, setSearchTerm] = useState("");
    const query = useQuery();
    const onFavouriteDeleted = useCallback((uuid: string): void => {
        setLocallyRemovedUuids((prev) => [...prev, uuid]);
    }, []);

    const onSearchClear = useCallback(() => setSearchTerm(""), []);
    const onSearchChange = useCallback((value: string) => setSearchTerm(value), []);

    const onSortChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newSortBy = e.target.value as SortValue;
            setSortBy(newSortBy);
            query.set(QueryNames.SORT, newSortBy);
        },
        [query],
    );

    const resetSearch = useCallback(() => {
        const el = document.querySelector<HTMLElement>("#search");
        el?.scrollIntoView({ behavior: "smooth" });
        setSearchTerm("");
    }, []);

    const onExpiredFilterChange = useCallback(() => {
        const next =
            filterBy === FilterByEnumValues.UNEXPIRED ? FilterByEnumValues.EXPIRED : FilterByEnumValues.UNEXPIRED;
        setFilterBy(next);
        query.set(QueryNames.FILTER, next);
    }, [filterBy, query]);

    const sortedAndFiltered = useMemo<readonly FavouriteInternal[]>(() => {
        const base = favourites.filter((f) => !locallyRemovedUuids.includes(f.uuid));

        const afterSearch = base.filter((f) => matchesSearch(f, searchTerm));

        const afterFilter =
            filterBy === FilterByEnumValues.EXPIRED
                ? afterSearch.filter((f) => f.favouriteAd.status !== "ACTIVE")
                : afterSearch.filter((f) => f.favouriteAd.status === "ACTIVE");

        const compare =
            sortBy === SortByEnumValues.PUBLISHED
                ? byDate<FavouriteInternal>((x) => x.favouriteAd.published, "desc")
                : sortBy === SortByEnumValues.EXPIRES
                  ? byDate<FavouriteInternal>((x) => x.favouriteAd.expires, "asc")
                  : byDate<FavouriteInternal>((x) => x.created, "desc");

        afterFilter.sort(compare);
        return afterFilter as readonly FavouriteInternal[];
    }, [favourites, locallyRemovedUuids, searchTerm, filterBy, sortBy]);

    const count = sortedAndFiltered.length;
    const message =
        searchTerm && count > 0
            ? `${formatNumber(count)} treff`
            : searchTerm
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
        <PageBlock as="section" width="lg" gutters className="mt-10 mb-10">
            <HStack gap="space-16" justify="center" className="mb-12">
                <Heading level="1" size="xlarge">
                    Favoritter
                </Heading>
            </HStack>
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
                ) : searchTerm ? (
                    <Heading level="2" size="medium" className="text-center">
                        Ingen treff
                    </Heading>
                ) : (
                    sortedAndFiltered.length === 0 && (
                        <Heading level="2" size="medium" className="text-center">
                            Ingen annonser
                        </Heading>
                    )
                )}
                <DebouncedLiveRegion message={message} />
            </VStack>
            {searchTerm && (
                <HStack justify="center" className={sortedAndFiltered.length !== 0 ? "mt-18" : "mt-6"}>
                    <Button variant="tertiary" onClick={() => resetSearch()} icon={<TrashIcon aria-hidden="true" />}>
                        Nullstill søk
                    </Button>
                </HStack>
            )}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-list-item-error" onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </AlertModalWithPageReload>
            )}
        </PageBlock>
    );
}

export default FavouritesList;
