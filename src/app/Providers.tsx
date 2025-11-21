"use client";

import React from "react";
import AuthenticationProvider from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import UserProvider from "@/app/stillinger/_common/user/UserProvider";
import { CookieBannerProvider } from "@/app/_common/cookie-banner/CookieBannerContext";
import { IsDebugProvider } from "@/app/_common/debug-provider/IsDebugProvider";

type ProvidersProps = {
    children: React.ReactNode;
};
function Providers({ children }: ProvidersProps) {
    return (
        <CookieBannerProvider>
            <IsDebugProvider>
                <AuthenticationProvider>
                    <UserProvider>{children}</UserProvider>
                </AuthenticationProvider>
            </IsDebugProvider>
        </CookieBannerProvider>
    );
}

export default Providers;
