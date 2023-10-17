import React, { useContext } from "react";
import { Button } from "@navikt/ds-react";
import { Link } from "react-router-dom";
import { ClockIcon, HeartIcon } from "@navikt/aksel-icons";
import { useHistory } from "react-router";
import useToggle from "../../../common/hooks/useToggle";
import { AuthenticationContext, AuthenticationStatus } from "../../../common/auth/contexts/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "../../../common/user/contexts/UserProvider";
import { CONTEXT_PATH } from "../../../common/environment";
import LoginModal from "../../../common/auth/components/LoginModal";
import TermsOfUse from "../../../common/user/contexts/TermsOfUse";

function LoggedInButtons() {
    const { authenticationStatus, loginAndRedirect } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModalFavorites, openLoginModalFavorites, closeLoginModalFavorites] = useToggle();
    const [shouldShowLoginModalSavedSearch, openLoginModalSavedSearch, closeLoginModalSavedSearch] = useToggle();
    const router = useHistory();

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
                to={`${CONTEXT_PATH}/lagrede-sok`}
                type="button"
                variant="tertiary"
                onClick={(e) => {
                    handleClick(e, `${CONTEXT_PATH}/lagrede-sok`, "SAVEDSEARCH");
                }}
                icon={<ClockIcon aria-hidden="true" />}
            >
                Bruk et lagret søk
            </Button>

            <Button
                as={Link}
                to={`${CONTEXT_PATH}/favoritter`}
                type="button"
                variant="tertiary"
                onClick={(e) => {
                    handleClick(e, `${CONTEXT_PATH}/favoritter`, "FAVORITES");
                }}
                icon={<HeartIcon aria-hidden="true" />}
            >
                Mine favoritter
            </Button>

            {shouldShowLoginModalSavedSearch && (
                <LoginModal
                    onLoginClick={() => {
                        loginAndRedirect(`${CONTEXT_PATH}/lagrede-sok`);
                    }}
                    onCloseClick={closeLoginModalSavedSearch}
                />
            )}

            {shouldShowLoginModalFavorites && (
                <LoginModal
                    onLoginClick={() => {
                        loginAndRedirect(`${CONTEXT_PATH}/favoritter`);
                    }}
                    onCloseClick={closeLoginModalFavorites}
                />
            )}

            {shouldShowTermsModal && (
                <TermsOfUse
                    onClose={closeTermsModal}
                    onTermsAccepted={() => {
                        handleTermsAccepted(`${CONTEXT_PATH}/favoritter`);
                    }}
                />
            )}
        </>
    );
}

export default LoggedInButtons;
