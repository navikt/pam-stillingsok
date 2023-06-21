import React, { useContext } from "react";
import PropTypes from "prop-types";
import { HeartIcon, HeartFillIcon } from "@navikt/aksel-icons";
import logAmplitudeEvent from "../../../common/tracking/amplitude";
import { HasAcceptedTermsStatus, UserContext } from "../../user/contexts/UserProvider";
import { AuthenticationContext, AuthenticationStatus } from "../../auth/contexts/AuthenticationProvider";
import { FavouritesContext } from "../context/FavouritesProvider";
import UserAPI from "../../../common/api/UserAPI";
import getWorkLocation from "../../../../server/common/getWorkLocation";
import getEmployer from "../../../../server/common/getEmployer";
import TermsOfUse from "../../user/contexts/TermsOfUse";
import LoginModal from "../../auth/components/LoginModal";
import useToggle from "../../../common/hooks/useToggle";
import IconButton from "../../../common/components/buttons/IconButton";
import AlertModalWithPageReload from "../../../common/components/modals/AlertModalWithPageReload";

/**
 * Displays a button "Lagre favoritt" or "Slett favoritt".
 *
 * If user click button, this view will ensure that user is logged in
 * and has accepted usage terms before it save a favourite
 */
function FavouritesButton({ id, stilling, useShortText, className, type, hideText }) {
    const {
        pendingFavourites,
        favourites,
        addToPending,
        addFavouriteToLocalList,
        removeFormPending,
        removeFavouriteFromLocalList,
    } = useContext(FavouritesContext);
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModal, openLoginModal, closeLoginModal] = useToggle();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);
    const isPending = pendingFavourites.includes(id);
    const isFavourite = favourites.find((f) => f.favouriteAd.uuid === id) !== undefined;

    function saveFavourite(adUuid, ad) {
        addToPending(adUuid);
        UserAPI.post("api/v1/userfavouriteads", {
            favouriteAd: {
                uuid: adUuid,
                source: ad.source,
                reference: ad.reference,
                title: ad.title,
                jobTitle: ad.properties.jobtitle ? ad.properties.jobtitle : null,
                status: ad.status,
                applicationdue: ad.properties.applicationdue ? ad.properties.applicationdue : null,
                location: getWorkLocation(ad.properties.location, ad.locationList),
                employer: getEmployer(ad),
                published: ad.published,
                expires: ad.expires,
            },
        })
            .then((response) => {
                addFavouriteToLocalList(response);
            })
            .catch(() => {
                openErrorDialog();
            })
            .finally(() => {
                removeFormPending(adUuid);
            });
    }

    function deleteFavourite(adUuid) {
        const found = favourites.find((fav) => fav.favouriteAd.uuid === adUuid);

        addToPending(adUuid);
        UserAPI.remove(`api/v1/userfavouriteads/${found.uuid}`)
            .then(() => {
                removeFavouriteFromLocalList(found);
            })
            .catch(() => {
                openErrorDialog();
            })
            .finally(() => {
                removeFormPending(adUuid);
            });
    }

    function handleSaveFavouriteClick() {
        logAmplitudeEvent("Click add to favourite button");
        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            openLoginModal();
        } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
            openTermsModal();
        } else if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            saveFavourite(id, stilling);
        }
    }

    function handleTermsAccepted() {
        closeTermsModal();
        saveFavourite(id, stilling);
    }

    function handleDeleteFavouriteClick() {
        deleteFavourite(id);
    }

    const saveText = useShortText ? "Lagre" : "Lagre annonse";
    const deleteText = useShortText ? "Lagret" : "Slett favoritt";

    return (
        <>
            <IconButton
                disabled={isPending}
                onClick={isFavourite ? handleDeleteFavouriteClick : handleSaveFavouriteClick}
                className={className ? `FavouriteButton ${className}` : "FavouritesButton"}
                text={isFavourite ? deleteText : saveText}
                icon={isFavourite ? <HeartFillIcon aria-hidden="true" /> : <HeartIcon aria-hidden="true" />}
                type={type}
                hideText={hideText}
            />

            {shouldShowLoginModal && <LoginModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && <TermsOfUse onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-page-error" onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </AlertModalWithPageReload>
            )}
        </>
    );
}

FavouritesButton.defaultProps = {
    className: undefined,
    useShortText: false,
    type: undefined,
    hideText: false,
};

FavouritesButton.propTypes = {
    id: PropTypes.string.isRequired,
    stilling: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    useShortText: PropTypes.bool,
    type: PropTypes.string,
    hideText: PropTypes.bool,
};

export default FavouritesButton;
