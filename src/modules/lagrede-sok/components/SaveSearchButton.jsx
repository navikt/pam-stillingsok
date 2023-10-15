import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Button } from "@navikt/ds-react";
import { FloppydiskIcon } from "@navikt/aksel-icons";
import SearchIsEmptyModal from "./modal/SearchIsEmptyModal";
import SaveSearchModal from "./modal/SaveSearchModal";
import { isSearchQueryEmpty, stringifyQuery, toReadableQuery, toSavedSearchQuery } from "../../sok/query";
import { AuthenticationContext, AuthenticationStatus } from "../../common/auth/contexts/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "../../common/user/contexts/UserProvider";
import { extractParam } from "../../common/utils/utils";
import TermsOfUse from "../../common/user/contexts/TermsOfUse";
import LoginModal from "../../common/auth/components/LoginModal";
import useToggle from "../../common/hooks/useToggle";
import { FormModes } from "./modal/SaveSearchForm";

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
        }
    }

    function handleTermsAccepted() {
        closeTermsModal();
        openSaveSearchModal();
    }

    const title = toReadableQuery(query);
    const shortenedTitle = title.length > 80 ? `${title.substring(0, 77)}...` : title;

    return (
        <>
            <Button variant="tertiary" icon={<FloppydiskIcon aria-hidden="true" />} type="button" onClick={handleClick}>
                Lagre søk
            </Button>

            {shouldShowQueryIsEmptyModal && <SearchIsEmptyModal onClose={closeQueryIsEmptyModal} />}

            {shouldShowLoginModal && <LoginModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && <TermsOfUse onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />}

            {shouldShowSaveSearchModal && (
                <SaveSearchModal
                    formData={{
                        title: shortenedTitle,
                        searchQuery: stringifyQuery(toSavedSearchQuery(query)),
                    }}
                    onClose={closeSaveSearchModal}
                    defaultFormMode={savedSearchUuid ? FormModes.UPDATE_QUERY_ONLY : FormModes.ADD}
                    savedSearchUuid={savedSearchUuid}
                />
            )}
        </>
    );
}

SaveSearchButton.propTypes = {
    query: PropTypes.shape({}),
};

export default SaveSearchButton;
