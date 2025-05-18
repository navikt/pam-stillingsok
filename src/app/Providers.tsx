"use client";

import React from "react";
import UserPreferenceProvider from "@/app/stillinger/_common/user/UserPreferenceProvider";
import AuthenticationProvider from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import UserProvider from "@/app/stillinger/_common/user/UserProvider";
import { IsDebugProvider } from "@/app/_common/debug-provider/IsDebugProvider";
import { UserPreferences } from "@/app/stillinger/_common/actions/userPreferencesActions";
import { CookieBannerProvider } from "@/app/_common/cookie-banner/CookieBannerContext";

type ProvidersProps = {
    children: React.ReactNode;
    userPreferences?: UserPreferences | undefined;
    userActionTaken: boolean | undefined;
};
function Providers({ children, userActionTaken, userPreferences }: ProvidersProps) {
    return (
        <CookieBannerProvider initialState={!userActionTaken}>
            <IsDebugProvider>
                <AuthenticationProvider>
                    <UserProvider>
                        <UserPreferenceProvider userPreferences={userPreferences}>{children}</UserPreferenceProvider>
                    </UserProvider>
                </AuthenticationProvider>
            </IsDebugProvider>
        </CookieBannerProvider>
    );
}

export default Providers;
