"use client";

import React from "react";
import PropTypes from "prop-types";
import UserPreferenceProvider from "@/app/_common/user/UserPreferenceProvider";
import AuthenticationProvider from "./_common/auth/contexts/AuthenticationProvider";
import UserProvider from "./_common/user/UserProvider";
import FavouritesProvider from "./favoritter/_components/FavouritesProvider";
import { IsDebugProvider } from "@/app/(sok)/_components/IsDebugProvider";

function Providers({ children, userPreferences }) {
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

Providers.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Providers;
