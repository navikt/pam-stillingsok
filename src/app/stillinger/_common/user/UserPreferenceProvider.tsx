import React, { ReactElement } from "react";
import { UserPreferences } from "@/app/stillinger/_common/actions/userPreferencesActions";

export const UserPreferencesContext: React.Context<UserPreferencesActions> = React.createContext(
    {} as UserPreferencesActions,
);

export type UserPreferencesActions = {
    locationOrDistance?: string;
};

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
