import { Favourite } from "@/app/stillinger/_common/types/Favorite";

export type FavouriteInternal = {
    uuid: string;
    created?: string;
    favouriteAd: Favourite;
};
