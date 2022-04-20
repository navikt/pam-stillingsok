import React, { useContext } from "react";
import { Knapp } from "@navikt/arbeidsplassen-knapper";
import SearchIsEmptyModal from "./modals/SearchIsEmptyModal";
import SaveSearchModal from "./modals/SaveSearchModal";
import { isSearchQueryEmpty, toReadableQuery, toSavedSearchQuery } from "../search/query";
import { AuthenticationContext, AuthenticationStatus } from "../../context/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "../../context/UserProvider";
import { extractParam, isStringEmpty, stringifyQueryObject } from "../../components/utils";
import TermsOfUse from "../../components/modals/TermsOfUse";
import LoginModal from "../../components/modals/LoginModal";
import useToggle from "../../hooks/useToggle";
import RegisterEmailModal from "./modals/RegisterEmailModal";

function SaveSearchButton({ query }) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus, user } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModal, openLoginModal, closeLoginModal] = useToggle();
    const [shouldShowSaveSearchModal, openSaveSearchModal, closeSaveSearchModal] = useToggle();
    const [shouldShowQueryIsEmptyModal, openQueryIsEmptyModal, closeQueryIsEmptyModal] = useToggle();
    const [shouldShowRegisterEmailModal, openRegisterEmailModal, closeRegisterEmailModal] = useToggle();
    const savedSearchIdFromBrowserUrl = extractParam("saved");

    function handleClick() {
        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            openLoginModal();
        } else if (isSearchQueryEmpty(toSavedSearchQuery(query))) {
            openQueryIsEmptyModal();
        } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
            openTermsModal();
        } else if (
            authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED &&
            hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
        ) {
            openSaveSearchModal();
        } else {
            // Ignore click if authentication or
            // hasAcceptedTermsStatus are not yet loaded or failed
            return false;
        }
    }

    function handleTermsAccepted() {
        closeTermsModal();
        openSaveSearchModal();
    }

    function registerEmailIfNecessary(response) {
        closeSaveSearchModal();
        if (response.notifyType === "EMAIL" && isStringEmpty(user.data.email)) {
            openRegisterEmailModal();
        }
    }

    return (
        <React.Fragment>
            <Knapp onClick={handleClick}>Lagre søk</Knapp>

            {shouldShowQueryIsEmptyModal && <SearchIsEmptyModal onClose={closeQueryIsEmptyModal} />}

            {shouldShowLoginModal && <LoginModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && <TermsOfUse onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />}

            {shouldShowRegisterEmailModal && <RegisterEmailModal onClose={closeRegisterEmailModal} />}

            {shouldShowSaveSearchModal && (
                <SaveSearchModal
                    formData={{
                        title: () => {
                            const title = toReadableQuery(query);
                            return title.length > 80 ? `${title.substring(0, 77)}...` : title;
                        },
                        duration: 30,
                        notifyType: "NONE",
                        status: "INACTIVE",
                        searchQuery: stringifyQueryObject(toSavedSearchQuery(query))
                    }}
                    onSuccess={registerEmailIfNecessary}
                    onClose={closeSaveSearchModal}
                    askIfReplaceOrUpdate={savedSearchIdFromBrowserUrl !== undefined}
                    defaultMode={savedSearchIdFromBrowserUrl !== undefined ? "update-search-query-only" : "add"}
                    savedSearchAsId={savedSearchIdFromBrowserUrl}
                />
            )}
        </React.Fragment>
    );
}

export default SaveSearchButton;
