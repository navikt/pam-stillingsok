"use client";

import React from "react";
import AuthenticationProvider from "@/app/(nonce)/stillinger/_common/auth/contexts/AuthenticationProvider";
import UserProvider from "@/app/(nonce)/stillinger/_common/user/UserProvider";
import { IsDebugProvider } from "@/app/_common/debug-provider/IsDebugProvider";

type ProvidersProps = {
    children: React.ReactNode;
};
function Providers({ children }: ProvidersProps) {
    return (
        <IsDebugProvider>
            <AuthenticationProvider>
                <UserProvider>{children}</UserProvider>
            </AuthenticationProvider>
        </IsDebugProvider>
    );
}

export default Providers;
