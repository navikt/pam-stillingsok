"use client";

import React from "react";
import PropTypes from "prop-types";
import AuthenticationProvider from "./_common/auth/contexts/AuthenticationProvider";
import UserProvider from "./_common/user/UserProvider";
import FavouritesProvider from "./favoritter/_components/FavouritesProvider";

function Providers({ children }) {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>{children}</FavouritesProvider>
            </UserProvider>
        </AuthenticationProvider>
    );
}

Providers.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Providers;
