"use client";

import React from "react";
import AuthenticationProvider from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import UserProvider from "@/app/stillinger/_common/user/UserProvider";
import { CookieBannerProvider } from "@/app/_common/cookie-banner/CookieBannerContext";
import { IsDebugProvider } from "@/app/_common/debug-provider/IsDebugProvider";

type ProvidersProps = {
    children: React.ReactNode;
    userActionTaken: boolean | undefined;
};
function Providers({ children, userActionTaken }: ProvidersProps) {
    return (
        <CookieBannerProvider initialState={!userActionTaken}>
            <IsDebugProvider>
                <AuthenticationProvider>
                    <UserProvider>{children}</UserProvider>
                </AuthenticationProvider>
            </IsDebugProvider>
        </CookieBannerProvider>
    );
}

export default Providers;
