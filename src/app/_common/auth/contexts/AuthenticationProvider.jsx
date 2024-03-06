import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SessionStatusModal from "@/app/_common/auth/components/SessionStatusModal";

export const AuthenticationContext = React.createContext({
    userNameAndInfo: undefined,
    authenticationStatus: undefined,
    login: () => {},
    logout: () => {},
    loginAndRedirect: () => {},
});

export const AuthenticationStatus = {
    NOT_FETCHED: "NO_FETCHED",
    IS_FETCHING: "IS_FETCHING",
    NOT_AUTHENTICATED: "IS_NOT_AUTHENTICATED",
    IS_AUTHENTICATED: "IS_AUTHENTICATED",
    FAILURE: "FAILURE",
};

function AuthenticationProvider({ children }) {
    const [authenticationStatus, setAuthenticationStatus] = useState(AuthenticationStatus.NOT_FETCHED);
    const [userNameAndInfo, setUserNameAndInfo] = useState(false);
    const [hasBeenLoggedIn, setHasBeenLoggedIn] = useState(false);

    const timeoutLogout = () => {
        window.location.href = `/stillinger/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
    };
    const markAsLoggedOut = () => {
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
    };

    function login() {
        window.location.href = `/stillinger/oauth2/login?redirect=${encodeURIComponent(window.location.href)}`;
    }

    function loginAndRedirect(navigateTo) {
        window.location.href = `/stillinger/oauth2/login?redirect=${encodeURIComponent(navigateTo)}`;
    }

    function logout() {
        window.location.href = `/stillinger/oauth2/logout?redirect=${encodeURIComponent("/utlogget")}`;
    }

    const fetchIsAuthenticated = () => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);

        fetch(`/stillinger/api/isAuthenticated`, {
            credentials: "include",
            referrer: process.env.NEXT_PUBLIC_CONTEXT_PATH,
            cache: "no-store",
        })
            .then((response) => {
                if (response.status === 200) {
                    setAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED);
                    setHasBeenLoggedIn(true);
                } else if (response.status === 401) {
                    setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
                    if (hasBeenLoggedIn) {
                        setHasBeenLoggedIn(false);
                        timeoutLogout();
                    }
                } else {
                    setAuthenticationStatus(AuthenticationStatus.FAILURE);
                }
            })
            .catch(() => {
                setAuthenticationStatus(AuthenticationStatus.FAILURE);
            });
    };

    async function fetchUserNameAndInfo() {
        const res = await fetch("/stillinger/api/user/personalia");

        if (res.ok && res.status === 200) {
            const data = await res.json();
            setUserNameAndInfo(data);
        }
    }

    useEffect(() => {
        fetchIsAuthenticated();
    }, []);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            fetchUserNameAndInfo();
        }
    }, [authenticationStatus]);

    return (
        <AuthenticationContext.Provider // eslint-disable-next-line
            value={{ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }}
        >
            <SessionStatusModal
                markAsLoggedOut={markAsLoggedOut}
                setHasBeenLoggedIn={setHasBeenLoggedIn}
                login={login}
                logout={logout}
                timeoutLogout={timeoutLogout}
                hasBeenLoggedIn={hasBeenLoggedIn}
            />
            {children}
        </AuthenticationContext.Provider>
    );
}

AuthenticationProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AuthenticationProvider;
