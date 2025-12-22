"use client";
import { QueryProvider } from "@/app/(nonce)/stillinger/(sok)/_components/QueryProvider";
import FavouritesList, { FavouritesListProps } from "@/app/(nonce)/stillinger/favoritter/_components/FavouritesList";

const FavouritesListWrapper = ({ favourites, sortPreference, filterPreference }: FavouritesListProps) => {
    return (
        <QueryProvider>
            <FavouritesList
                favourites={favourites}
                sortPreference={sortPreference}
                filterPreference={filterPreference}
            />
        </QueryProvider>
    );
};
export default FavouritesListWrapper;
