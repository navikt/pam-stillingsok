import React, {useContext} from "react";
import PropTypes from "prop-types";
import {captureException} from "@sentry/browser";
import {HasAcceptedTermsStatus, UserContext} from "../../context/UserProvider";
import {AuthenticationContext, AuthenticationStatus} from "../../context/AuthenticationProvider";
import {FavouritesContext} from "../../context/FavouritesProvider";
import StarIcon from "../../components/icons/StarIcon";
import UserAPI from "../../api/UserAPI";
import getWorkLocation from "../../../server/common/getWorkLocation";
import getEmployer from "../../../server/common/getEmployer";
import TermsOfUse from "../../components/modals/TermsOfUse";
import LoginModal from "../../components/modals/LoginModal";
import useToggle from "../../hooks/useToggle";
import IconButton from "../../components/buttons/IconButton";
import AlertModalWithPageReload from "../../components/modals/AlertModalWithPageReload";
import HeartIcon from "../../components/icons/HeartIcon";
import HeartIconFilled from "../../components/icons/HeartIconFilled";

/**
 * Displays a button "Lagre favoritt" or "Slett favoritt".
 *
 * If user click button, this view will ensure that user is logged in
 * and has accepted usage terms before it save a favourite
 */
function FavouritesButton({ id, stilling, useShortText, className, type }) {
    const favouritesProvider = useContext(FavouritesContext);
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModal, openLoginModal, closeLoginModal] = useToggle();
    const [shouldShowErrorDialog, openErrorDialog, closeErrorDialog] = useToggle(false);
    const isPending = favouritesProvider.pendingFavourites.includes(id);
    const isFavourite = favouritesProvider.favourites.find((f) => f.favouriteAd.uuid === id) !== undefined;

    function saveFavourite(id, ad) {
        favouritesProvider.addToPending(id);
        UserAPI.post("api/v1/userfavouriteads", {
            favouriteAd: {
                uuid: id,
                source: ad.source,
                reference: ad.reference,
                title: ad.title,
                jobTitle: ad.properties.jobtitle ? ad.properties.jobtitle : null,
                status: ad.status,
                applicationdue: ad.properties.applicationdue ? ad.properties.applicationdue : null,
                location: getWorkLocation(ad.properties.location, ad.locationList),
                employer: getEmployer(ad),
                published: ad.published,
                expires: ad.expires
            }
        })
            .then((response) => {
                favouritesProvider.addFavouriteToLocalList(response);
            })
            .catch((err) => {
                captureException(err);
                openErrorDialog();
            })
            .finally(() => {
                favouritesProvider.removeFormPending(id);
            });
    }

    function deleteFavourite(id) {
        const found = favouritesProvider.favourites.find((fav) => fav.favouriteAd.uuid === id);

        favouritesProvider.addToPending(id);
        UserAPI.remove(`api/v1/userfavouriteads/${found.uuid}`)
            .then(() => {
                favouritesProvider.removeFavouriteFromLocalList(found);
            })
            .catch((err) => {
                captureException(err);
                openErrorDialog();
            })
            .finally(() => {
                favouritesProvider.removeFormPending(id);
            });
    }

    function handleSaveFavouriteClick() {
        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            openLoginModal();
        } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
            openTermsModal();
        } else if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            saveFavourite(id, stilling);
        } else {
            // Ignore click if authentication or hasAcceptedTermsStatus
            // are not yet loaded or failed
            return false;
        }
    }

    function handleTermsAccepted() {
        closeTermsModal();
        saveFavourite(id, stilling);
    }

    function handleDeleteFavouriteClick() {
        deleteFavourite(id);
    }

    const saveText = useShortText ? "Lagre": "Lagre som favoritt";
    const deleteText = useShortText ? "Lagret": "Slett favoritt";

    return (
        <React.Fragment>
            <IconButton
                disabled={isPending}
                onClick={isFavourite ? handleDeleteFavouriteClick : handleSaveFavouriteClick}
                className={className ? `FavouriteButton ${className}` : "FavouritesButton"}
                text={isFavourite ? deleteText : saveText}
                icon={isFavourite ? <HeartIconFilled ariaHidden={!useShortText} /> : <HeartIcon ariaHidden={!useShortText}/>}
                type={type}
            />

            {shouldShowLoginModal && <LoginModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && <TermsOfUse onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-page-error" onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </AlertModalWithPageReload>
            )}
        </React.Fragment>
    );
}

FavouritesButton.defaultProps = {
    className: undefined,
    useShortText: false,
    type: undefined
};

FavouritesButton.propTypes = {
    id: PropTypes.string.isRequired,
    stilling: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    useShortText: PropTypes.bool,
    type: PropTypes.string
};

export default FavouritesButton;
