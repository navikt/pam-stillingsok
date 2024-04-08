import React from "react";
import PropTypes from "prop-types";
import * as actions from "@/app/_common/actions";

export const UserPreferencesContext = React.createContext({});

function UserPreferencesProvider({ children, userPreferences }) {
    function addClosedFilter(panelId) {
        actions.addClosedFilter(panelId);
    }

    function removeClosedFilter(panelId) {
        actions.removeClosedFilter(panelId);
    }

    function dismissPanel(panelId) {
        actions.dismissPanel(panelId);
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
}

UserPreferencesProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default UserPreferencesProvider;
