import React, { useContext } from "react";
import { Button, Hide, HStack, Show } from "@navikt/ds-react";
import Link from "next/link";
import { ClockDashedIcon, HeartIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/navigation";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "@/app/stillinger/_common/user/UserProvider";
import LoginModal from "@/app/stillinger/_common/auth/components/LoginModal";
import UserConsentModal from "@/app/stillinger/_common/user/UserConsentModal";

type ButtonsProps = {
    showText: boolean;
    handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, navigateTo: string, type: string) => boolean;
};
function Buttons({ showText, handleClick }: ButtonsProps) {
    return (
        <HStack gap="1">
            <Button
                as={Link}
                role="link"
                href="/lagrede-sok"
                variant="tertiary"
                onClick={(e) => {
                    handleClick(e, "/lagrede-sok", "SAVEDSEARCH");
                }}
                icon={<ClockDashedIcon aria-hidden="true" />}
                aria-label={!showText ? "Lagrede søk" : undefined}
            >
                {showText && "Lagrede søk"}
            </Button>

            <Button
                as={Link}
                role="link"
                href="/stillinger/favoritter"
                variant="tertiary"
                onClick={(e) => {
                    handleClick(e, "/stillinger/favoritter", "FAVORITES");
                }}
                icon={<HeartIcon aria-hidden="true" />}
                aria-label={!showText ? "Favoritter" : undefined}
            >
                {showText && "Favoritter"}
            </Button>
        </HStack>
    );
}

function LoggedInButtons() {
    const { authenticationStatus, loginAndRedirect } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModalFavorites, openLoginModalFavorites, closeLoginModalFavorites] = useToggle();
    const [shouldShowLoginModalSavedSearch, openLoginModalSavedSearch, closeLoginModalSavedSearch] = useToggle();
    const router = useRouter();

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, navigateTo: string, type: string) {
        e.preventDefault();
        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && type === "FAVORITES") {
            openLoginModalFavorites();
        } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && type === "SAVEDSEARCH") {
            openLoginModalSavedSearch();
        } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
            openTermsModal();
        } else if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            router.push(navigateTo);
        }
        return false;
    }

    function handleTermsAccepted(navigateTo: string) {
        closeTermsModal();
        router.push(navigateTo);
    }

    return (
        <>
            <Show above="md">
                <Buttons showText handleClick={handleClick} />
            </Show>
            <Hide above="md">
                <Buttons showText={false} handleClick={handleClick} />
            </Hide>
            {shouldShowLoginModalSavedSearch && (
                <LoginModal
                    onLoginClick={() => {
                        loginAndRedirect("/stillinger/lagrede-sok");
                    }}
                    onCloseClick={closeLoginModalSavedSearch}
                />
            )}

            {shouldShowLoginModalFavorites && (
                <LoginModal
                    onLoginClick={() => {
                        loginAndRedirect("/stillinger/favoritter");
                    }}
                    onCloseClick={closeLoginModalFavorites}
                />
            )}

            {shouldShowTermsModal && (
                <UserConsentModal
                    onClose={closeTermsModal}
                    onTermsAccepted={() => {
                        handleTermsAccepted("/stillinger/favoritter");
                    }}
                />
            )}
        </>
    );
}

export default LoggedInButtons;
