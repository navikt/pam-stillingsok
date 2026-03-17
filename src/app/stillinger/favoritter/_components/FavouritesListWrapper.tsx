"use client";
import FavouritesList, { FavouritesListProps } from "@/app/stillinger/favoritter/_components/FavouritesList";

const FavouritesListWrapper = ({ favourites, sortPreference, filterPreference }: FavouritesListProps) => {
    return (
        <FavouritesList favourites={favourites} sortPreference={sortPreference} filterPreference={filterPreference} />
    );
};
export default FavouritesListWrapper;
