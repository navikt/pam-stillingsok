import React from "react";
import PropTypes from "prop-types";

export const UserPreferencesContext = React.createContext({});

function UserPreferencesProvider({ children, userPreferences }) {
    function saveCookieValue(key, value) {
        console.log(key, value);
    }

    return (
        <UserPreferencesContext.Provider
            value={{ closedFilterAccordions: userPreferences.closedFilterAccordions, saveCookieValue }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

UserPreferencesProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default UserPreferencesProvider;
