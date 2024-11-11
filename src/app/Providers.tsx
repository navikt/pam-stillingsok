"use client";

import React from "react";
import UserPreferenceProvider from "@/app/_common/user/UserPreferenceProvider";
import AuthenticationProvider from "./_common/auth/contexts/AuthenticationProvider";
import UserProvider from "./_common/user/UserProvider";
import FavouritesProvider from "./favoritter/_components/FavouritesProvider";
import { IsDebugProvider } from "@/app/(sok)/_components/IsDebugProvider";
import { UserPreferences } from "@/app/_common/actions/userPreferencesActions";

type ProvidersProps = {
    children: React.ReactNode;
    userPreferences?: UserPreferences | undefined;
};
function Providers({ children, userPreferences }: ProvidersProps) {
    return (
        <IsDebugProvider>
            <AuthenticationProvider>
                <UserProvider>
                    <UserPreferenceProvider userPreferences={userPreferences}>
                        <FavouritesProvider>{children}</FavouritesProvider>
                    </UserPreferenceProvider>
                </UserProvider>
            </AuthenticationProvider>
        </IsDebugProvider>
    );
}

export default Providers;
