"use client";

import React, { useContext } from "react";
import { Button, ButtonProps } from "@navikt/ds-react";
import { HeartFillIcon, HeartIcon } from "@navikt/aksel-icons";
import { HasAcceptedTermsStatus, UserContext } from "@/app/_common/user/UserProvider";
import { AuthenticationContext, AuthenticationStatus } from "@/app/_common/auth/contexts/AuthenticationProvider";
import getWorkLocation from "@/app/_common/utils/getWorkLocation";
import UserConsentModal from "@/app/_common/user/UserConsentModal";
import LoginModal from "@/app/_common/auth/components/LoginModal";
import useToggle from "@/app/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import * as actions from "@/app/_common/actions";
import { FavouritesContext } from "./FavouritesProvider";
import { StillingDetaljer } from "@/app/lib/stillingSchema";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

interface FavouritesButtonProps extends ButtonProps {
    id: string;
    stilling: StillingSoekElement | StillingDetaljer;
    className?: string;
    useShortText?: boolean;
    hideText?: boolean;
}

function FavouritesButton({
    id,
    stilling,
    className,
    variant = "primary",
    useShortText = false,
    hideText = false,
}: FavouritesButtonProps): JSX.Element {
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

    async function saveFavourite(adUuid: string, ad: FavouritesButtonProps["stilling"]): Promise<void> {
        addToPending(adUuid);
        try {
            const favourite = await actions.addFavouriteAction({
                uuid: adUuid,
                source: ad.source,
                reference: ad.reference,
                title: ad.title,
                jobTitle: ad.jobTitle,
                status: ad.status,
                applicationdue: ad.applicationDue,
                location: getWorkLocation(ad.location, ad.locationList),
                employer: ad.employer?.name,
                published: ad.published,
                expires: ad.expires,
            });

            addFavouriteToLocalList(favourite);
        } catch (err) {
            openErrorDialog();
        }
        removeFormPending(adUuid);
    }

    async function deleteFavourite(adUuid: string): Promise<void> {
        const found = favourites.find((fav) => fav.favouriteAd.uuid === adUuid);

        if (!found) return; // Early return if not found

        addToPending(adUuid);

        try {
            await actions.deleteFavouriteAction(found.uuid);
            removeFavouriteFromLocalList(found);
        } catch (err) {
            openErrorDialog();
        }

        removeFormPending(adUuid);
    }

    function handleSaveFavouriteClick(): void {
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

    function handleTermsAccepted(): void {
        closeTermsModal();
        saveFavourite(id, stilling);
    }

    function handleDeleteFavouriteClick(): void {
        deleteFavourite(id);
    }

    const saveText = useShortText ? "Lagre" : "Lagre som favoritt";
    const deleteText = useShortText ? "Lagret" : "Slett favoritt";
    const buttonText = isFavourite ? deleteText : saveText;

    return (
        <>
            <Button
                variant={variant}
                disabled={isPending}
                onClick={isFavourite ? handleDeleteFavouriteClick : handleSaveFavouriteClick}
                className={className ? `FavouriteButton ${className}` : "FavouritesButton"}
                icon={isFavourite ? <HeartFillIcon aria-hidden="true" /> : <HeartIcon aria-hidden="true" />}
                aria-label={hideText ? buttonText : undefined}
            >
                {!hideText ? buttonText : undefined}
            </Button>

            {shouldShowLoginModal && <LoginModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && (
                <UserConsentModal onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />
            )}

            {shouldShowErrorDialog && (
                <AlertModalWithPageReload id="favourites-page-error" onClose={closeErrorDialog} title="Feil">
                    Det oppsto en feil ved dine favoritter. Prøv å last siden på nytt
                </AlertModalWithPageReload>
            )}
        </>
    );
}

export default FavouritesButton;
