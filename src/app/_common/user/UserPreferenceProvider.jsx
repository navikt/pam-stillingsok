import React from "react";
import PropTypes from "prop-types";
import * as actions from "@/app/_common/actions";

export const UserPreferencesContext = React.createContext({});

function UserPreferencesProvider({ children, userPreferences }) {
    function addOpenFilter(panelId) {
        try {
            actions.addOpenFilter(panelId);
        } catch (err) {
            // ignore fetch failed
        }
    }

    function removeOpenFilter(panelId) {
        try {
            actions.removeOpenFilter(panelId);
        } catch (err) {
            // ignore fetch failed
        }
    }

    function addPublishedJobFilterOpen() {
        try {
            actions.addPublishedJobFilterOpen();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function removePublishedJobFilterOpen() {
        try {
            actions.removePublishedJobFilterOpen();
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
            // eslint-disable-next-line
            value={{
                resultsPerPage: userPreferences?.resultsPerPage,
                openFilters: userPreferences?.openFilters || [],
                publishedJobFilterOpen: !!(
                    userPreferences?.publishedJobFilterOpen === undefined ||
                    userPreferences?.publishedJobFilterOpen === true
                ),
                addOpenFilter,
                removeOpenFilter,
                dismissPanel,
                addPublishedJobFilterOpen,
                removePublishedJobFilterOpen,
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
