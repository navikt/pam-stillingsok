import PropTypes from 'prop-types';
import React from 'react';

import * as actions from '@/app/_common/actions';

export const UserPreferencesContext = React.createContext({});

const UserPreferencesProvider = ({ children, userPreferences }) => {
  function addClosedFilter(panelId) {
    try {
      actions.addClosedFilter(panelId);
    } catch (err) {
      // ignore fetch failed
    }
  }

  function removeClosedFilter(panelId) {
    try {
      actions.removeClosedFilter(panelId);
    } catch (err) {
      // ignore fetch failed
    }
  }

  function dismissPanel(panelId) {
    try {
      actions.dismissPanel(panelId);
    } catch (err) {
      // ignore fetch failed
    }
  }

  return (
    <UserPreferencesContext.Provider

      value={{
        closedFilters: userPreferences?.closedFilters || [],
        addClosedFilter,
        removeClosedFilter,
        dismissPanel,
        dismissedPanels: userPreferences?.dismissedPanels || [],
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

UserPreferencesProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default UserPreferencesProvider;
