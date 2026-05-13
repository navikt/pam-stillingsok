"use client";

import type React from "react";
import { CookieBannerProvider } from "@/app/_common/cookie-banner/CookieBannerContext";
import { IsDebugProvider } from "@/app/_common/debug-provider/IsDebugProvider";
import AuthenticationProvider from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import UserProvider from "@/app/stillinger/_common/user/UserProvider";

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
