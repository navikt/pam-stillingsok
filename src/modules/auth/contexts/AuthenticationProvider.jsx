import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CONTEXT_PATH, LOGIN_URL, LOGOUT_URL } from "../../../common/environment";
import { setLoggedIn } from "../../../common/tracking/amplitude";

export const AuthenticationContext = React.createContext({});

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

    const fetchIsAuthenticated = () => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);

        fetch(`/stillinger/isAuthenticated`, {
            credentials: "include",
            referrer: CONTEXT_PATH,
        })
            .then((response) => {
                if (response.status === 200) {
                    setAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED);
                    setLoggedIn(true);
                } else if (response.status === 401) {
                    setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
                    setLoggedIn(false);
                } else {
                    setAuthenticationStatus(AuthenticationStatus.FAILURE);
                    setLoggedIn(false);
                }
            })
            .catch(() => {
                setAuthenticationStatus(AuthenticationStatus.FAILURE);
                setLoggedIn(false);
            });
    };

    function fetchUserNameAndInfo() {
        if (process.env.NODE_ENV === "production") {
            fetch("/stillinger/headerinfo", {
                method: "GET",
                credentials: "include",
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((result) => {
                        setUserNameAndInfo(result);
                    });
                }
            });
        } else {
            const testData = {
                fornavn: "Kristin",
                etternavn: "Lavransdatter",
                erUnderFemten: false,
            };
            setUserNameAndInfo(testData);
        }
    }

    function login() {
        window.location.href = `/stillinger${LOGIN_URL}?redirect=${encodeURIComponent(window.location.href)}`;
    }

    function loginAndRedirect(navigateTo) {
        window.location.href = `/stillinger${LOGIN_URL}?redirect=${encodeURIComponent(navigateTo)}`;
    }

    function logout() {
        window.location.href = `/stillinger${LOGOUT_URL}`;
    }

    useEffect(() => {
        fetchIsAuthenticated();
    }, []);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            fetchUserNameAndInfo();
        }
    }, [authenticationStatus]);

    const args = useMemo(() => ({ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }), []);
    return <AuthenticationContext.Provider value={args}>{children}</AuthenticationContext.Provider>;
}

AuthenticationProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AuthenticationProvider;
