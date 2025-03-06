import React, { ReactElement, useContext } from "react";
import { Button, ButtonProps } from "@navikt/ds-react";
import { FloppydiskIcon } from "@navikt/aksel-icons";
import { useSearchParams } from "next/navigation";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { HasAcceptedTermsStatus, UserContext } from "@/app/stillinger/_common/user/UserProvider";
import UserConsentModal from "@/app/stillinger/_common/user/UserConsentModal";
import LoginModal from "@/app/stillinger/_common/auth/components/LoginModal";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import useQuery from "@/app/stillinger/_components/QueryProvider";
import { AllowedSavedSearchParams, QueryNames } from "@/app/stillinger/_utils/QueryNames";
import { FormModes } from "./modal/SaveSearchForm";
import SaveSearchModal from "./modal/SaveSearchModal";
import SearchIsEmptyModal from "./modal/SearchIsEmptyModal";

interface SaveSearchButtonProps extends ButtonProps {}

export function toSavedSearch(urlSearchParams: URLSearchParams): URLSearchParams {
    const savedSearchUrlSearchParams = new URLSearchParams();
    urlSearchParams.forEach((value: string, key: string) => {
        if (AllowedSavedSearchParams.includes(key)) {
            savedSearchUrlSearchParams.append(key, value);
        }
    });
    return savedSearchUrlSearchParams;
}

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
function SaveSearchButton({ size }: SaveSearchButtonProps): ReactElement {
    const query = useQuery();

    const { authenticationStatus, login } = useContext(AuthenticationContext);
    const { hasAcceptedTermsStatus } = useContext(UserContext);
    const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
    const [shouldShowLoginModal, openLoginModal, closeLoginModal] = useToggle();
    const [shouldShowSaveSearchModal, openSaveSearchModal, closeSaveSearchModal] = useToggle();
    const [shouldShowQueryIsEmptyModal, openQueryIsEmptyModal, closeQueryIsEmptyModal] = useToggle();

    const searchParams = useSearchParams();
    const savedSearchUuid = searchParams?.get("saved");

    function handleClick(): void {
        const savedSearchUrlWithoutVersion = toSavedSearch(query.urlSearchParams);
        savedSearchUrlWithoutVersion.delete(QueryNames.URL_VERSION);

        if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            openLoginModal();
        } else if (savedSearchUrlWithoutVersion.size === 0) {
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

    function handleTermsAccepted(): void {
        closeTermsModal();
        openSaveSearchModal();
    }

    return (
        <>
            <Button
                variant="tertiary"
                size={size}
                icon={<FloppydiskIcon aria-hidden="true" />}
                type="button"
                onClick={handleClick}
            >
                Lagre søk
            </Button>

            {shouldShowQueryIsEmptyModal && <SearchIsEmptyModal onClose={closeQueryIsEmptyModal} />}

            {shouldShowLoginModal && <LoginModal onLoginClick={login} onCloseClick={closeLoginModal} />}

            {shouldShowTermsModal && (
                <UserConsentModal onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} />
            )}

            {shouldShowSaveSearchModal && (
                <SaveSearchModal
                    formData={{
                        title: "",
                        searchQuery: `?${toSavedSearch(query.urlSearchParams).toString()}`,
                    }}
                    onClose={closeSaveSearchModal}
                    defaultFormMode={savedSearchUuid ? FormModes.UPDATE_QUERY_ONLY : FormModes.ADD}
                    savedSearchUuid={savedSearchUuid}
                />
            )}
        </>
    );
}

export default SaveSearchButton;
