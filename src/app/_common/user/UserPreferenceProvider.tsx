import React, { ReactElement } from "react";
import * as actions from "@/app/_common/actions";
import { UserPreferences } from "@/app/_common/actions/userPreferencesActions";

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
    locationOrDistance?: string;
};

interface UserPreferencesProviderProps {
    children: React.ReactNode;
    userPreferences?: UserPreferences;
}

function UserPreferencesProvider({ children, userPreferences }: UserPreferencesProviderProps): ReactElement {
    function addOpenFilter(panelId: string): void {
        try {
            actions.addOpenFilter(panelId).then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function removeOpenFilter(panelId: string): void {
        try {
            actions.removeOpenFilter(panelId).then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function addPublishedJobFilterOpen(): void {
        try {
            actions.addPublishedJobFilterOpen().then();
        } catch (err) {
            // ignore fetch failed
        }
    }

    function removePublishedJobFilterOpen(): void {
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
            value={{
                openFilters: userPreferences?.openFilters || [],
                publishedJobFilterOpen:
                    userPreferences?.publishedJobFilterOpen === undefined ||
                    userPreferences?.publishedJobFilterOpen === true,
                addOpenFilter,
                removeOpenFilter,
                dismissPanel,
                addPublishedJobFilterOpen,
                removePublishedJobFilterOpen,
                locationOrDistance: userPreferences?.locationOrDistance,
                dismissedPanels: userPreferences?.dismissedPanels || [],
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

export default UserPreferencesProvider;
