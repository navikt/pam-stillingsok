import React, { useContext } from "react";
import { Button } from "@navikt/ds-react";
import Link from "next/link";
import { ClockIcon, HeartIcon } from "@navikt/aksel-icons";
import { useRouter } from "next/navigation";
import useToggle from "@/app/_common/hooks/useToggle";
import { AuthenticationContext, AuthenticationStatus } from "@/app/_common/auth/contexts/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "@/app/_common/user/UserProvider";
import LoginModal from "@/app/_common/auth/components/LoginModal";
import UserConsentModal from "@/app/_common/user/UserConsentModal";

function LoggedInButtons() {
    const { authenticationStatus, loginAndRedirect } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModalFavorites, openLoginModalFavorites, closeLoginModalFavorites] = useToggle();
    const [shouldShowLoginModalSavedSearch, openLoginModalSavedSearch, closeLoginModalSavedSearch] = useToggle();
    const router = useRouter();

    function handleClick(e, navigateTo, type) {
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

    function handleTermsAccepted(navigateTo) {
        closeTermsModal();
        router.push(navigateTo);
    }

    return (
        <>
            <Button
                as={Link}
                role="link"
                href="/lagrede-sok"
                variant="tertiary"
                onClick={(e) => {
                    handleClick(e, "/lagrede-sok", "SAVEDSEARCH");
                }}
                icon={<ClockIcon aria-hidden="true" />}
            >
                Lagrede søk
            </Button>

            <Button
                as={Link}
                role="link"
                href="/favoritter"
                variant="tertiary"
                onClick={(e) => {
                    handleClick(e, "/favoritter", "FAVORITES");
                }}
                icon={<HeartIcon aria-hidden="true" />}
            >
                Favoritter
            </Button>

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
                        handleTermsAccepted("/favoritter");
                    }}
                />
            )}
        </>
    );
}

export default LoggedInButtons;
