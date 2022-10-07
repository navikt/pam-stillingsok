import React, { useContext } from "react";
import SearchIsEmptyModal from "./modal/SearchIsEmptyModal";
import SaveSearchModal from "./modal/SaveSearchModal";
import { isSearchQueryEmpty, stringifyQuery, toReadableQuery, toSavedSearchQuery } from "../Search/query";
import { AuthenticationContext, AuthenticationStatus } from "../Authentication/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "../User/UserProvider";
import { extractParam } from "../../components/utils";
import UserConsentModal from "../User/UserConsentModal";
import AuthenticationModal from "../Authentication/AuthenticationModal";
import useToggle from "../../hooks/useToggle";
import { FormModes } from "./modal/SaveSearchForm";
import Button from "../../components/Button/Button";

/**
 * Displays the "Save search" button.
 * If user click the button, this view will open a modal where
 * user can define and save a search.
 *
 * Before user can save a search, this view will ensure that user
 * - is logged in
 * - has checked one or more search criteria
 * - has accepted terms
 */
function SaveSearchButton({ query }) {
    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModal, openLoginModal, closeLoginModal] = useToggle();
    const [shouldShowSaveSearchModal, openSaveSearchModal, closeSaveSearchModal] = useToggle();
    const [shouldShowQueryIsEmptyModal, openQueryIsEmptyModal, closeQueryIsEmptyModal] = useToggle();
    const savedSearchUuid = extractParam("saved");

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
            return false;
        }
    }

    function handleTermsAccepted() {
        closeTermsModal();
        openSaveSearchModal();
    }

    return (
        <React.Fragment>
            <Button variant="secondary" type="button" onClick={handleClick}>
                Lagre søk
            </Button>

            {shouldShowQueryIsEmptyModal && <SearchIsEmptyModal onClose={closeQueryIsEmptyModal} />}

            {shouldShowLoginModal && <AuthenticationModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && (
                <UserConsentModal onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />
            )}

            {shouldShowSaveSearchModal && (
                <SaveSearchModal
                    formData={{
                        title: () => {
                            const title = toReadableQuery(query);
                            return title.length > 80 ? `${title.substring(0, 77)}...` : title;
                        },
                        searchQuery: stringifyQuery(toSavedSearchQuery(query))
                    }}
                    onClose={closeSaveSearchModal}
                    defaultFormMode={savedSearchUuid ? FormModes.UPDATE_QUERY_ONLY : FormModes.ADD}
                    savedSearchUuid={savedSearchUuid}
                />
            )}
        </React.Fragment>
    );
}

export default SaveSearchButton;
