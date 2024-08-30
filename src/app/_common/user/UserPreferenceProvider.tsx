import React from "react";
import PropTypes from "prop-types";
import * as actions from "@/app/_common/actions";

export const UserPreferencesContext: React.Context<UserPreferencesActions> = React.createContext(
    {} as UserPreferencesActions,
);

export type UserPreferencesActions = {
    openFilters: string[];
    publishedJobFilterOpen: boolean;
    dismissedPanels: string[];
    addOpenFilter: (panelId: string) => void;
    removeOpenFilter: (panelId: string) => void;
    addPublishedJobFilterOpen: () => void;
    removePublishedJobFilterOpen: () => void;
    dismissPanel: (panelId: string) => void;
};

interface UserPreferencesProviderProps {
    children: React.ReactNode;
    userPreferences: UserPreferencesActions;
}

function UserPreferencesProvider({ children, userPreferences }: UserPreferencesProviderProps) {
    function addOpenFilter(panelId: string): void {
        try {
            actions.addOpenFilter(panelId).then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function removeOpenFilter(panelId: string) {
        try {
            actions.removeOpenFilter(panelId).then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function addPublishedJobFilterOpen() {
        try {
            actions.addPublishedJobFilterOpen().then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function removePublishedJobFilterOpen() {
        try {
            actions.removePublishedJobFilterOpen().then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function dismissPanel(panelId: string): void {
        try {
            actions.dismissPanel(panelId).then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    return (
        <UserPreferencesContext.Provider
            // eslint-disable-next-line
            value={{
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