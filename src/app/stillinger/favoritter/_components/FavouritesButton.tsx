"use client";

import React, { useContext } from "react";
import { Button, ButtonProps } from "@navikt/ds-react";
import { HeartFillIcon, HeartIcon } from "@navikt/aksel-icons";
import { HasAcceptedTermsStatus, UserContext } from "@/app/stillinger/_common/user/UserProvider";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import UserConsentModal from "@/app/stillinger/_common/user/UserConsentModal";
import LoginModal from "@/app/stillinger/_common/auth/components/LoginModal";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import * as actions from "@/app/stillinger/_common/actions";
import { FavouritesContext } from "./FavouritesProvider";
import { Favourite } from "@/app/stillinger/_common/types/Favorite";
import { track } from "@/app/_common/umami";
import { FavorittPlassering } from "@/app/_common/umami/events";

interface FavouritesButtonProps extends ButtonProps {
    id: string;
    stilling: Favourite;
    className?: string;
    useShortText?: boolean;
    hideText?: boolean;
    index?: number;
    plassering: FavorittPlassering;
}

function FavouritesButton({
    id,
    stilling,
    className,
    variant = "primary",
    useShortText = false,
    hideText = false,
    index,
    plassering,
}: FavouritesButtonProps) {
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
            const favourite = await actions.addFavouriteAction(ad);

            addFavouriteToLocalList(favourite);
        } catch {
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
        } catch {
            openErrorDialog();
        }

        removeFormPending(adUuid);
    }

    function handleSaveFavouriteClick(): void {
        track("lagre favoritt", {
            title: stilling.title,
            index: index,
            adId: id,
            harSamtykket: hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED,
            erInnlogget: authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED,
            plassering: plassering,
        });
        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            openLoginModal();
        } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
            openTermsModal();
        } else if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            void saveFavourite(id, stilling);
        }
    }

    function handleTermsAccepted(): void {
        closeTermsModal();
        void saveFavourite(id, stilling);
    }

    function handleDeleteFavouriteClick(): void {
        track("fjern favoritt", {
            title: stilling.title,
            adId: id,
            plassering: plassering,
        });
        void deleteFavourite(id);
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

            {shouldShowLoginModal && (
                <LoginModal
                    onLoginClick={() => {
                        login();

                        track("logg inn for å lagre favoritt", {
                            title: stilling.title,
                            adId: id,
                            plassering: plassering,
                        });
                    }}
                    onCloseClick={() => {
                        closeLoginModal();

                        track("avbryt lagre favoritt", {
                            title: stilling.title,
                            adId: id,
                            plassering: plassering,
                        });
                    }}
                />
            )}

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
