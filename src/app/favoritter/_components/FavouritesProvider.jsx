import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { HasAcceptedTermsStatus, UserContext } from "@/app/_common/user/UserProvider";
import useToggle from "@/app/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import * as actions from "@/app/_common/actions";

export const FavouritesContext = React.createContext({
    favourites: [],
    pendingFavourites: [],
    addToPending: () => {},
    removeFormPending: () => {},
    addFavouriteToLocalList: () => {},
    removeFavouriteFromLocalList: () => {},
});

/**
 * Provides a global list over all favourites the user have. This can
 * be used to check if an ad is marked as a favourite, and then either
 * show the "Save as favourite" or "Remove favourite" button.
 *
 * It also provides a list over all pending ads that are about to be saved or
 * removed as a favourite. This can be used to disable multiple clicks
 * on the favourite button, to prevent network race conditions while saving or deleting.
 */
function FavouritesProvider({ children }) {
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    // List of all favourites
    const [favourites, setFavourites] = useState([]);

    // List of all ads that is about to be saved or deleted
    const [pendingFavourites, setPendingFavourites] = useState([]);

    async function getFavourites() {
        try {
            const content = await actions.getFavouritesAction();
            setFavourites(content || []);
        } catch (err) {
            openErrorDialog();
        }
    }

    function addToPending(id) {
        setPendingFavourites((prevState) => [...prevState, id]);
    }

    function removeFormPending(id) {
        setPendingFavourites((prevState) => prevState.filter((it) => it !== id));
    }

    function addFavouriteToLocalList(favourite) {
        const found = favourites.find((it) => it.uuid === favourite.uuid);
        if (!found) {
            setFavourites((prevState) => [favourite, ...prevState]);
        }
    }

    function removeFavouriteFromLocalList(favourite) {
        setFavourites((prevState) => prevState.filter((it) => it.uuid !== favourite.uuid));
    }

    useEffect(() => {
        if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED) {
            getFavourites();
        }
    }, [hasAcceptedTermsStatus]);

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const values = {
        favourites,
        pendingFavourites,
        addToPending,
        removeFormPending,
        addFavouriteToLocalList,
        removeFavouriteFromLocalList,
    };

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

FavouritesProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default FavouritesProvider;
