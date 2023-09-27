import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CONTEXT_PATH, LOGIN_URL, LOGOUT_URL } from "../../../common/environment";
import TimeoutModal, { Reason } from "../components/TimeoutModal";

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
    const [hasBeenLoggedIn, setHasBeenLoggedIn] = useState(false);
    const [isSessionExpiring, setIsSessionExpiring] = useState(null);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(null);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
    const [timeoutReason, setTimeoutReason] = useState(Reason.NO_MODAL);

    const timeoutLogout = () => {
        window.location.href = "/utlogget?timeout=true";
    };

    const fetchIsAuthenticated = () => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);

        fetch(`/stillinger/isAuthenticated`, {
            credentials: "include",
            referrer: CONTEXT_PATH,
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

    const handleSessionInfoResponse = async (response, errorMessage) => {
        if (response.status === 401) {
            setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
            if (hasBeenLoggedIn) {
                setHasBeenLoggedIn(false);
                timeoutLogout();
            }
        } else if (response.status < 200 || response.status >= 300) {
            console.error(errorMessage);
        } else {
            setHasBeenLoggedIn(true);
            const { session, tokens } = await response.json();

            if (!session.active) {
                setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
                timeoutLogout();
                return;
            }

            const sessionIsExpiring = session.ends_in_seconds < 60 * 5;
            const sessionIsTimingOut =
                session.timeout_in_seconds > -1
                    ? session.timeout_in_seconds < 60 * 5
                    : tokens.expire_in_seconds < 60 * 5;

            setIsSessionExpiring(sessionIsExpiring);
            setIsSessionTimingOut(sessionIsTimingOut);

            if (sessionIsTimingOut && !sessionIsExpiring) setTimeoutReason(Reason.TIMEOUT);
            else if (sessionIsExpiring) setTimeoutReason(Reason.EXPIRY);
            else setTimeoutReason(Reason.NO_MODAL);
        }
    };

    const fetchSessionInfo = async () => {
        const response = await fetch(`/stillinger/oauth2/session`, { credentials: "include", referrer: CONTEXT_PATH });
        await handleSessionInfoResponse(response, "Det oppstod en feil ved henting av session status");
    };

    const refreshToken = async () => {
        const response = await fetch(`/stillinger/oauth2/session/refresh`, {
            method: "POST",
            credentials: "include",
            referrer: CONTEXT_PATH,
        });
        await handleSessionInfoResponse(response, "Det oppstod en feil ved refreshing av token");
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

    useEffect(() => {
        const scheduledInterval = setInterval(() => fetchSessionInfo(), 30 * 1000);
        fetchSessionInfo();
        return () => clearInterval(scheduledInterval);
    }, []);

    useEffect(() => {
        setIsTimeoutModalOpen(isSessionExpiring || isSessionTimingOut);
    }, [isSessionTimingOut, isSessionExpiring]);

    return (
        <AuthenticationContext.Provider // eslint-disable-next-line
            value={{ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }}
        >
            {children}
            {isTimeoutModalOpen && (
                <TimeoutModal modalReason={timeoutReason} refresh={refreshToken} login={login} logout={logout} />
            )}
        </AuthenticationContext.Provider>
    );
}

AuthenticationProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AuthenticationProvider;
