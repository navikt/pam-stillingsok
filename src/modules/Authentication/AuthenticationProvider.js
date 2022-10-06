import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { captureException } from "@sentry/browser";
import { AD_USER_API, CONTEXT_PATH, LOGIN_URL, LOGOUT_URL, STILLINGSOK_URL } from "../../environment";
import { extractParam } from "../../components/utils";
import { stringifyQuery } from "../Search/query";

export const AuthenticationContext = React.createContext({});

export const AuthenticationStatus = {
    NOT_FETCHED: "NO_FETCHED",
    IS_FETCHING: "IS_FETCHING",
    NOT_AUTHENTICATED: "IS_NOT_AUTHENTICATED",
    IS_AUTHENTICATED: "IS_AUTHENTICATED",
    FAILURE: "FAILURE"
};

const allowedRedirectUrls = [
    `${CONTEXT_PATH}/intern`,
    `${CONTEXT_PATH}/stilling`,
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    CONTEXT_PATH
];

const AuthenticationProvider = ({ children }) => {
    const [authenticationStatus, setAuthenticationStatus] = useState(AuthenticationStatus.NOT_FETCHED);
    const [userNameAndInfo, setUserNameAndInfo] = useState(false);

    useEffect(() => {
        fetchIsAuthenticated();
    }, []);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            fetchUserNameAndInfo();
        }
    }, [authenticationStatus]);

    const fetchIsAuthenticated = () => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);

        fetch(`${AD_USER_API}/isAuthenticated`, {
            credentials: "include",
            referrer: CONTEXT_PATH
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
            .catch((err) => {
                captureException(err);
                setAuthenticationStatus(AuthenticationStatus.FAILURE);
            });
    };

    function fetchUserNameAndInfo() {
        if (process.env.NODE_ENV === "production") {
            fetch("/api/cv/rest/person/headerinfo", {
                method: "GET",
                credentials: "include"
            })
                .then((response) => response.json())
                .then((result) => {
                    setUserNameAndInfo(result);
                })
                .catch((err) => {
                    captureException(err);
                });
        } else {
            const testData = {
                fornavn: "Kristin",
                etternavn: "Lavransdatter",
                erUnderFemten: false
            };
            setUserNameAndInfo(testData);
        }
    }

    function login() {
        let redirectUrlAfterSuccessfulLogin;
        const path = window.location.pathname;
        if (path.includes("/rapporter-annonse")) {
            // Send bruker tilbake til stillingen de vil rapportere etter logg inn
            redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/stilling${stringifyQuery({
                uuid: window.location.search.split("=")[1]
            })}`;
        } else if (path.startsWith(`${CONTEXT_PATH}/stilling/`)) {
            // 'stilling/:uuid' er ikke en allowedRedirectUrls url, så vi må mappe om til /stilling?uuid=<uuid>
            redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/stilling${stringifyQuery({
                uuid: path.split(`${CONTEXT_PATH}/stilling/`)[1]
            })}`;
        } else if (path.startsWith(`${CONTEXT_PATH}/intern/`)) {
            // 'intern/:uuid' er ikke en allowedRedirectUrls url, så vi må mappe om til /intern?uuid=<uuid>
            redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/intern${stringifyQuery({
                uuid: path.split(`${CONTEXT_PATH}/intern/`)[1]
            })}`;
        } else if (path.startsWith(`${CONTEXT_PATH}/lagrede-sok`)) {
            const query = {};
            const uuid = extractParam("uuid");
            if (uuid !== null) query["uuid"] = uuid;
            redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/lagrede-sok${stringifyQuery(query)}`;
        } else if (path === CONTEXT_PATH) {
            redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}${window.location.search}`;
        } else if (allowedRedirectUrls.includes(path)) {
            redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/${path.split(`${CONTEXT_PATH}/`)[1]}`;
        } else {
            redirectUrlAfterSuccessfulLogin = STILLINGSOK_URL;
        }
        window.location.href = `${LOGIN_URL}?level=Level3&redirect=${encodeURIComponent(
            redirectUrlAfterSuccessfulLogin
        )}`;
    }

    function logout() {
        window.location.href = LOGOUT_URL;
    }

    return (
        <AuthenticationContext.Provider value={{ userNameAndInfo, authenticationStatus, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

AuthenticationProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default AuthenticationProvider;

/**
 * Om man logget inn mens man var inne på en stillingsannonse, så vil loginservice
 * redirecte til en url med dette url-formatet: '/stillinger/stilling?uuid=12345'.
 * Redirecter derfor til riktig url-format: '/stillinger/stilling/:uuid'
 */
export function fixUrlAfterLogin() {
    if (window.location.pathname === `${CONTEXT_PATH}/stilling`) {
        const uuid = extractParam("uuid");
        window.history.replaceState({}, "", `${CONTEXT_PATH}/stilling/${uuid}`);
    } else if (window.location.pathname === `${CONTEXT_PATH}/intern`) {
        const uuid = extractParam("uuid");
        window.history.replaceState({}, "", `${CONTEXT_PATH}/intern/${uuid}`);
    }
}
