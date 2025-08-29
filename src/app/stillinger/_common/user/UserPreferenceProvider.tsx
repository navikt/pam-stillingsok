"use client";
import React, { ReactElement } from "react";
import { SearchTestState, UserPreferences } from "@/app/stillinger/_common/actions/userPreferencesActions";

export type UserPreferencesActions = {
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
    return (
        <UserPreferencesContext.Provider
            value={{
                locationOrDistance: userPreferences?.locationOrDistance,
            }}
        >
            {children}
        </UserPreferencesContext.Provider>
    );
}

export default UserPreferencesProvider;
