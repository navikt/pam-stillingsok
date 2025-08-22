"use client";
import React, { ReactElement } from "react";
import * as actions from "@/app/stillinger/_common/actions";
import { SearchTestState, UserPreferences } from "@/app/stillinger/_common/actions/userPreferencesActions";

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
    setSearchTestKeyValue: <K extends keyof SearchTestState>(key: K, value: SearchTestState[K]) => void;
    testInfo?: SearchTestState;
};
export const UserPreferencesContext = React.createContext<UserPreferencesActions>({} as UserPreferencesActions);

interface UserPreferencesProviderProps {
    children: React.ReactNode;
    userPreferences?: UserPreferences;
}

function UserPreferencesProvider({ children, userPreferences }: UserPreferencesProviderProps): ReactElement {
    // ✅ Lokal state
    const [state, setState] = React.useState<{
        openFilters: string[];
        publishedJobFilterOpen: boolean;
        dismissedPanels: string[];
        locationOrDistance?: string;
        testInfo: SearchTestState;
    }>({
        openFilters: userPreferences?.openFilters ?? [],
        publishedJobFilterOpen:
            userPreferences?.publishedJobFilterOpen === undefined || userPreferences.publishedJobFilterOpen === true,
        dismissedPanels: userPreferences?.dismissedPanels ?? [],
        locationOrDistance: userPreferences?.locationOrDistance,
        testInfo: userPreferences?.testInfo ?? { testInfoCardOpen: true },
    });

    // Hvis server prop endrer seg (navigasjon), sync inn igjen
    React.useEffect(() => {
        if (!userPreferences) return;
        setState((prev) => ({
            openFilters: userPreferences.openFilters ?? prev.openFilters,
            publishedJobFilterOpen:
                userPreferences.publishedJobFilterOpen === undefined || userPreferences.publishedJobFilterOpen === true,
            dismissedPanels: userPreferences.dismissedPanels ?? prev.dismissedPanels,
            locationOrDistance: userPreferences.locationOrDistance ?? prev.locationOrDistance,
            testInfo: userPreferences.testInfo ?? prev.testInfo,
        }));
    }, [userPreferences]);

    // Bruk transition for å kjøre server action uten å blokkere interaksjon
    const [, startTransition] = React.useTransition();

    function addOpenFilter(panelId: string): void {
        setState((prev) => ({ ...prev, openFilters: Array.from(new Set([...prev.openFilters, panelId])) }));
        startTransition(() => {
            void actions.addOpenFilter(panelId);
        });
    }

    function removeOpenFilter(panelId: string): void {
        setState((prev) => ({ ...prev, openFilters: prev.openFilters.filter((it) => it !== panelId) }));
        startTransition(() => {
            void actions.removeOpenFilter(panelId);
        });
    }

    function addPublishedJobFilterOpen(): void {
        setState((prev) => ({ ...prev, publishedJobFilterOpen: true }));
        startTransition(() => {
            void actions.addPublishedJobFilterOpen();
        });
    }

    function removePublishedJobFilterOpen(): void {
        setState((prev) => ({ ...prev, publishedJobFilterOpen: false }));
        startTransition(() => {
            void actions.removePublishedJobFilterOpen();
        });
    }

    function dismissPanel(panelId: string): void {
        setState((prev) => ({
            ...prev,
            dismissedPanels: Array.from(new Set([...prev.dismissedPanels, panelId])),
        }));
        startTransition(() => {
            void actions.dismissPanel(panelId);
        });
    }

    function setSearchTestKeyValue<K extends keyof SearchTestState>(key: K, value: SearchTestState[K]): void {
        setState((prev) => ({ ...prev, testInfo: { ...prev.testInfo, [key]: value } as SearchTestState }));
        startTransition(() => {
            void actions.setSearchTestFlag(key, value);
        });
    }

    return (
        <UserPreferencesContext.Provider
            value={{
                openFilters: state?.openFilters || [],
                publishedJobFilterOpen:
                    state?.publishedJobFilterOpen === undefined || state?.publishedJobFilterOpen === true,
                addOpenFilter,
                removeOpenFilter,
                dismissPanel,
                addPublishedJobFilterOpen,
                removePublishedJobFilterOpen,
                locationOrDistance: state?.locationOrDistance,
                dismissedPanels: state?.dismissedPanels || [],
                setSearchTestKeyValue,
                testInfo: state?.testInfo,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

export default UserPreferencesProvider;
