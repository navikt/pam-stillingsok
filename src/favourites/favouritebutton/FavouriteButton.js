import React, { useContext } from 'react';
import { FavouritesContext } from '../FavouritesProvider';
import './FavouriteButton.less';

export default function FavouriteButton({ad, showButtonText = true}) {
    const { removeFavourite, addFavourite, isFavourite, isPending } = useContext(FavouritesContext);

    const onSaveClick = () => {
        addFavourite(ad);
    };

    const onRemoveClick = () => {
        removeFavourite(ad.uuid);
    };

    return (
        <button
            className="FavouriteButton Knapp Knapp--flat"
            onClick={isFavourite(ad.uuid) ? onRemoveClick : onSaveClick}
            disabled={isPending}
            aria-pressed={isFavourite(ad.uuid)}
        >
            <div className="FavouriteButton__inner">
                <span className={isFavourite(ad.uuid) ? "FavouriteButton__star--active" : "FavouriteButton__star"} />
                <span className={!showButtonText ? "sr-only" : ""}>{isFavourite(ad.uuid) ? "Slett favoritt" : "Lagre favoritt"}</span>
            </div>
        </button>
    );
}
