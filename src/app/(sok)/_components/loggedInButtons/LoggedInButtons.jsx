import { ClockIcon, HeartIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';

import LoginModal from '@/app/_common/auth/components/LoginModal';
import { AuthenticationContext, AuthenticationStatus } from '@/app/_common/auth/contexts/AuthenticationProvider';
import useToggle from '@/app/_common/hooks/useToggle';
import UserConsentModal from '@/app/_common/user/UserConsentModal';
import { HasAcceptedTermsStatus, UserContext } from '@/app/_common/user/UserProvider';

function LoggedInButtons() {
  const { authenticationStatus, loginAndRedirect } = useContext(AuthenticationContext);
  const { hasAcceptedTermsStatus } = useContext(UserContext);
  const [shouldShowTermsModal, openTermsModal, closeTermsModal] = useToggle();
  const [shouldShowLoginModalFavorites, openLoginModalFavorites, closeLoginModalFavorites] = useToggle();
  const [shouldShowLoginModalSavedSearch, openLoginModalSavedSearch, closeLoginModalSavedSearch] = useToggle();
  const router = useRouter();

  function handleClick(e, navigateTo, type) {
    e.preventDefault();
    if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && type === 'FAVORITES') {
      openLoginModalFavorites();
    } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && type === 'SAVEDSEARCH') {
      openLoginModalSavedSearch();
    } else if (hasAcceptedTermsStatus === HasAcceptedTermsStatus.NOT_ACCEPTED) {
      openTermsModal();
    } else if (
      authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED
            && hasAcceptedTermsStatus === HasAcceptedTermsStatus.HAS_ACCEPTED
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
        href="/lagrede-sok"
        icon={<ClockIcon aria-hidden="true" />}
        role="link"
        variant="tertiary"
        onClick={(e) => {
          handleClick(e, '/lagrede-sok', 'SAVEDSEARCH');
        }}
      >
        Lagrede søk
      </Button>

      <Button
        as={Link}
        href="/favoritter"
        icon={<HeartIcon aria-hidden="true" />}
        role="link"
        variant="tertiary"
        onClick={(e) => {
          handleClick(e, '/favoritter', 'FAVORITES');
        }}
      >
        Favoritter
      </Button>

      {shouldShowLoginModalSavedSearch ? (
        <LoginModal
          onCloseClick={closeLoginModalSavedSearch}
          onLoginClick={() => {
            loginAndRedirect('/stillinger/lagrede-sok');
          }}
        />
      ) : null}

      {shouldShowLoginModalFavorites ? (
        <LoginModal
          onCloseClick={closeLoginModalFavorites}
          onLoginClick={() => {
            loginAndRedirect('/stillinger/favoritter');
          }}
        />
      ) : null}

      {shouldShowTermsModal ? (
        <UserConsentModal
          onClose={closeTermsModal}
          onTermsAccepted={() => {
            handleTermsAccepted('/favoritter');
          }}
        />
      ) : null}
    </>
  );
}

export default LoggedInButtons;
