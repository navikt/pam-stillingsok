import { FloppydiskIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import {
  isSearchQueryEmpty, stringifyQuery, toReadableQuery, toSavedSearchQuery,
} from '@/app/(sok)/_utils/query';
import LoginModal from '@/app/_common/auth/components/LoginModal';
import { AuthenticationContext, AuthenticationStatus } from '@/app/_common/auth/contexts/AuthenticationProvider';
import useToggle from '@/app/_common/hooks/useToggle';
import UserConsentModal from '@/app/_common/user/UserConsentModal';
import { HasAcceptedTermsStatus, UserContext } from '@/app/_common/user/UserProvider';

import { FormModes } from './modal/SaveSearchForm';
import SaveSearchModal from './modal/SaveSearchModal';
import SearchIsEmptyModal from './modal/SearchIsEmptyModal';

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
const SaveSearchButton = ({ query }) => {
  const { authenticationStatus, login } = useContext(AuthenticationContext);
  const { hasAcceptedTermsStatus } = useContext(UserContext);
  const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
  const [shouldShowLoginModal, openLoginModal, closeLoginModal] = useToggle();
  const [shouldShowSaveSearchModal, openSaveSearchModal, closeSaveSearchModal] = useToggle();
  const [shouldShowQueryIsEmptyModal, openQueryIsEmptyModal, closeQueryIsEmptyModal] = useToggle();

  const searchParams = useSearchParams();
  const savedSearchUuid = searchParams.get('saved');

  function handleClick() {
    if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
      openLoginModal();
    } else if (isSearchQueryEmpty(toSavedSearchQuery(query))) {
      openQueryIsEmptyModal();
    } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
      openTermsModal();
    } else if (
      authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED
            && hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
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
      <Button icon={<FloppydiskIcon aria-hidden="true" />} type="button" variant="tertiary" onClick={handleClick}>
        Lagre søk
      </Button>

      {shouldShowQueryIsEmptyModal ? <SearchIsEmptyModal onClose={closeQueryIsEmptyModal} /> : null}

      {shouldShowLoginModal ? <LoginModal onCloseClick={closeLoginModal} onLoginClick={login} /> : null}

      {shouldShowTermsModal ? <UserConsentModal onClose={closeTermsModal} onTermsAccepted={handleTermsAccepted} /> : null}

      {shouldShowSaveSearchModal ? (
        <SaveSearchModal
          defaultFormMode={savedSearchUuid ? FormModes.UPDATE_QUERY_ONLY : FormModes.ADD}
          savedSearchUuid={savedSearchUuid}
          formData={{
            title: shortenedTitle,
            searchQuery: stringifyQuery(toSavedSearchQuery(query)),
          }}
          onClose={closeSaveSearchModal}
        />
      ) : null}
    </>
  );
};

SaveSearchButton.propTypes = {
  query: PropTypes.shape({}),
};

export default SaveSearchButton;
