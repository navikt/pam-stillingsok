'use client';

import PropTypes from 'prop-types';
import React from 'react';

import UserPreferenceProvider from '@/app/_common/user/UserPreferenceProvider';

import AuthenticationProvider from './_common/auth/contexts/AuthenticationProvider';
import UserProvider from './_common/user/UserProvider';
import FavouritesProvider from './favoritter/_components/FavouritesProvider';

function Providers({ children, userPreferences }) {
  return <AuthenticationProvider>
    <UserProvider>
      <UserPreferenceProvider userPreferences={userPreferences}>
        <FavouritesProvider>{children}</FavouritesProvider>
      </UserPreferenceProvider>
    </UserProvider>
  </AuthenticationProvider>
}

Providers.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Providers;
