import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CONTEXT_PATH, LOGIN_URL, LOGOUT_URL } from "../../../common/environment";
import TimeoutModal from "../components/TimeoutModal";

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
    const [isTokenExpiring, setIsTokenExpiring] = useState(null);
    const [isSessionExpiring, setIsSessionExpiring] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(null);
    const [isSessionTimingOut, setIsSessionTimingOut] = useState(null);
    const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false)

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

    const fetchSessionInfo = async () => {
        const response = await fetch(`/stillinger/oauth2/session`, {credentials: "include", referrer: CONTEXT_PATH})
        await handleSessionInfoResponse(response, "Det oppstod en feil ved henting av session status")
    }

    const refreshToken = async () => {
        console.log("Refresher token") // TODO fjern
        const response = await fetch(`stillinger/oauth2/session/refresh`, {
            method: "POST",
            credentials: "include",
            referrer: CONTEXT_PATH
        })
        await handleSessionInfoResponse(response, "Det oppstod en feil ved refreshing av token")
    }

    const handleSessionInfoResponse = async (response, errorMessage) => {
        if (response.status === 401) {
            setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED)
        } else if (response.status < 200 || response.status >= 300) {
            console.error(errorMessage) // Todo ?? Fjern ??
        } else {
            const {session, tokens} = await response.json()
            setIsSessionExpiring(session.ends_in_seconds < 60)//60 * 10)
            setIsTokenExpiring(tokens.expire_in_seconds < 30)//60 * 5)
            setIsSessionTimingOut(session.timeout_in_seconds > -1 && session.timeout_in_seconds < 30)//60 * 5)
            setIsSessionActive(session.active)

            // TODO Fjern disse
            console.log("Session", session)
            console.log("Tokens", tokens)
        }
    }

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
        } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
            fetchSessionInfo()
        }
    }, [authenticationStatus]);

    useEffect(() => {
        if (isSessionActive && isTokenExpiring) refreshToken();
    }, [isTokenExpiring, isSessionExpiring, isSessionActive]);

    useEffect(() => {
        const scheduledInterval = setInterval(() => fetchSessionInfo(), 10 * 1000)
        return () => clearInterval(scheduledInterval)
    }, []);

    useEffect(() => {
        setIsTimeoutModalOpen(isSessionExpiring || isSessionExpiring)
    }, [isSessionTimingOut, isSessionExpiring])

    const closeModal = () => setIsTimeoutModalOpen(false)

    // TODO: FJERN DETTE
    console.log("isSessionActive", isSessionActive)
    console.log("isTokenExpiring", isTokenExpiring)
    console.log("isSessionExpiring", isSessionExpiring)
    console.log("isSessionTimingOut", isSessionTimingOut)

    return (
        <AuthenticationContext.Provider // eslint-disable-next-line
            value={{ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }}
        >
            {children}
            {isTimeoutModalOpen && <TimeoutModal isSessionExpiring isSessionTimingOut onCloseClick={closeModal}/>}
        </AuthenticationContext.Provider>
    );
}

AuthenticationProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AuthenticationProvider;
