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
    const [isSessionExpiring, setIsSessionExpiring] = useState(null);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(null);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
    const [modalReason, setModalReason] = useState(Reason.NO_MODAL);

    const timeoutLogout = () => {
        // const logoutComponents = LOGOUT_URL.split("=");
        // const url = `/stillinger${logoutComponents[0]}`;
        // const encodedRedirect = encodeURIComponent(`${logoutComponents[1]}?timeout=true`);
        const logoutUrl = `/stillinger/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
        console.log("Ny versjon a 16:00", logoutUrl);
        window.location.href = logoutUrl;
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
                } else if (response.status === 401) {
                    setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
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
        } else if (response.status < 200 || response.status >= 300) {
            console.error(errorMessage); // Todo ?? Fjern ??
        } else {
            const { session, tokens } = await response.json();

            if (!session.active || session.ends_in_seconds < 3560) {
                console.log("Logger ut :)");
                timeoutLogout();
                return;
            }

            const sessionIsExpiring = session.ends_in_seconds < 60 * 10;
            const sessionIsTimingOut =
                session.timeout_in_seconds > -1
                    ? session.timeout_in_seconds < 60 * 5
                    : tokens.expire_in_seconds < 60 * 5; // 60 * 5

            setIsSessionExpiring(sessionIsExpiring);
            setIsSessionTimingOut(sessionIsTimingOut);

            // TODO Fjern disse
            console.log("Session", session);
            console.log("Tokens", tokens);

            if (sessionIsTimingOut && !sessionIsExpiring) setModalReason(Reason.TIMEOUT);
            else if (sessionIsExpiring) setModalReason(Reason.EXPIRY);
            else setModalReason(Reason.NO_MODAL);
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
        const logoutUrl = `/stillinger/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
        window.location.href = logoutUrl;
    }

    useEffect(() => {
        fetchIsAuthenticated();
    }, []);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            fetchUserNameAndInfo();
        } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            fetchSessionInfo();
        }
    }, [authenticationStatus]);

    useEffect(() => {
        const scheduledInterval = setInterval(() => fetchSessionInfo(), 30 * 1000);
        return () => clearInterval(scheduledInterval);
    }, []);

    useEffect(() => {
        setIsTimeoutModalOpen(isSessionExpiring || isSessionTimingOut);
    }, [isSessionTimingOut, isSessionExpiring]);

    // TODO: FJERN DETTE
    console.log("isSessionExpiring", isSessionExpiring);
    console.log("isSessionTimingOut", isSessionTimingOut);
    console.log("isTimeoutModalOpen", isTimeoutModalOpen);
    console.log("modalReason", modalReason);
    const logoutComponents = LOGOUT_URL.split("=");
    const url = `/stillinger${logoutComponents[0]}`;
    const encodedRedirect = encodeURIComponent(`${logoutComponents[1]}?timeout=true`);
    console.log("redirect", `${url}=${encodedRedirect}`);

    return (
        <AuthenticationContext.Provider // eslint-disable-next-line
            value={{ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }}
        >
            {children}
            {isTimeoutModalOpen && (
                <TimeoutModal modalReason={modalReason} refresh={refreshToken} login={login} logout={logout} />
            )}
        </AuthenticationContext.Provider>
    );
}

AuthenticationProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AuthenticationProvider;
