import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { captureException } from "@sentry/browser";
import { adUserApiGet } from "../api/aduser/adUserApi";
import { HasAcceptedTermsStatus, UserContext } from "./UserProvider";
import { NotificationsContext } from "./NotificationsProvider";

export const FavouritesContext = React.createContext({});

const FavouritesProvider = ({ children }) => {
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const { notifyError } = useContext(NotificationsContext);

    // List of all favourites
    const [favourites, setFavourites] = useState([]);

    // List of all favourites that is about to be saved or deleted
    const [pendingFavourites, setPendingFavourites] = useState([]);

    useEffect(() => {
        if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED) {
            getFavourites();
        }
    }, [hasAcceptedTermsStatus]);

    function getFavourites() {
        adUserApiGet("api/v1/userfavouriteads?size=9999")
            .then((response) => {
                setFavourites(response.content ? response.content : []);
            })
            .catch((err) => {
                captureException(err);
                notifyError("Det oppsto en feil med favoritter. Prøv å laste siden på nytt");
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

    return <FavouritesContext.Provider value={values}>{children}</FavouritesContext.Provider>;
};

FavouritesProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default FavouritesProvider;
