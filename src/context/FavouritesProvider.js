import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { captureException } from "@sentry/browser";
import UserAPI from "../api/UserAPI";
import { HasAcceptedTermsStatus, UserContext } from "./UserProvider";
import useToggle from "../hooks/useToggle";
import ErrorWithReloadPageModal from "../components/modals/ErrorWithReloadPageModal";

export const FavouritesContext = React.createContext({});

/**
 * Provides a global list over all favourites the user have. This can
 * be used to check if an ad is marked as a favourite, and then either
 * show the "Save as favourite" or "Remove favourite" button.
 *
 * It also provides a list over all pending ads that are about to be saved or
 * removed as a favourite. This can be used to disable multiple clicks
 * on the favourite button, to prevent network race conditions while saving or deleting.
 */
const FavouritesProvider = ({ children }) => {
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);

    // List of all favourites
    const [favourites, setFavourites] = useState([]);

    // List of all ads that is about to be saved or deleted
    const [pendingFavourites, setPendingFavourites] = useState([]);

    useEffect(() => {
        if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED) {
            getFavourites();
        }
    }, [hasAcceptedTermsStatus]);

    function getFavourites() {
        UserAPI.get("api/v1/userfavouriteads?size=9999")
            .then((response) => {
                setFavourites(response.content ? response.content : []);
            })
            .catch((err) => {
                captureException(err);
                openErrorDialog();
            });
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

    const values = {
        favourites,
        pendingFavourites,
        addToPending,
        removeFormPending,
        addFavouriteToLocalList,
        removeFavouriteFromLocalList
    };

    return (
        <FavouritesContext.Provider value={values}>
            {children}

            {shouldShowErrorDialog && (
                <ErrorWithReloadPageModal onClose={closeErrorDialog} title="Feil">
                    Klarte ikke å hente dine favoritter. Prøv å laste siden på nytt
                </ErrorWithReloadPageModal>
            )}
        </FavouritesContext.Provider>
    );
};

FavouritesProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default FavouritesProvider;
