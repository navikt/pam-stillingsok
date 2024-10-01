"use client";

import React, { useContext, useEffect, useState, ReactNode, useMemo, useCallback } from "react";
import { HasAcceptedTermsStatus, UserContext } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import * as actions from "@/app/_common/actions";

interface FavouriteAd {
    uuid: string;
    title: string;
    published: string;
    status: string;
    employer: string;
    jobTitle: string;
    location: string;
    applicationdue: string;
}

interface Favourite {
    uuid: string;
    favouriteAd: FavouriteAd;
}

interface FavouritesContextType {
    favourites: Favourite[];
    pendingFavourites: string[];
    addToPending: (id: string) => void;
    removeFormPending: (id: string) => void;
    addFavouriteToLocalList: (favourite: Favourite) => void;
    removeFavouriteFromLocalList: (favourite: Favourite) => void;
}

export const FavouritesContext = React.createContext<FavouritesContextType>({
    favourites: [],
    pendingFavourites: [],
    addToPending: () => {},
    removeFormPending: () => {},
    addFavouriteToLocalList: () => {},
    removeFavouriteFromLocalList: () => {},
});

interface FavouritesProviderProps {
    children: ReactNode;
}

function FavouritesProvider({ children }: FavouritesProviderProps): JSX.Element {
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    const [favourites, setFavourites] = useState<Favourite[]>([]);

    const [pendingFavourites, setPendingFavourites] = useState<string[]>([]);

    const getFavourites = useCallback(async (): Promise<void> => {
        try {
            const content = await actions.getFavouritesAction();
            setFavourites(content || []);
        } catch (err) {
            openErrorDialog();
        }
    }, [openErrorDialog]);

    const addToPending = (id: string): void => {
        setPendingFavourites((prevState) => [...prevState, id]);
    };

    const removeFormPending = (id: string): void => {
        setPendingFavourites((prevState) => prevState.filter((it) => it !== id));
    };

    const addFavouriteToLocalList = (favourite: Favourite): void => {
        const found = favourites.find((it) => it.uuid === favourite.uuid);
        if (!found) {
            setFavourites((prevState) => [favourite, ...prevState]);
        }
    };

    const removeFavouriteFromLocalList = (favourite: Favourite): void => {
        setFavourites((prevState) => prevState.filter((it) => it.uuid !== favourite.uuid));
    };

    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED && !hasFetched) {
            getFavourites();
            setHasFetched(true);
        }
    }, [hasAcceptedTermsStatus, getFavourites, hasFetched]);

    const values = useMemo(
        () => ({
            favourites,
            pendingFavourites,
            addToPending,
            removeFormPending,
            addFavouriteToLocalList,
            removeFavouriteFromLocalList,
        }),
        [favourites, pendingFavourites],
    );

    return (
        <FavouritesContext.Provider value={values}>
            {children}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-provider-error" onClose={closeErrorDialog} title="Feil">
                    Klarte ikke å hente dine favoritter. Prøv å laste siden på nytt
                </AlertModalWithPageReload>
            )}
        </FavouritesContext.Provider>
    );
}

export default FavouritesProvider;