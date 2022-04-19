import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AD_USER_API, CONTEXT_PATH, LOGIN_URL, LOGOUT_URL, STILLINGSOK_URL } from "../environment";
import {extractParam, parseQueryString, stringifyQueryObject} from "../components/utils";

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

function getLoginUrl(path) {
    let redirectUrlAfterSuccessfulLogin;

    if (path.includes("/rapporter-annonse")) {
        // Send bruker tilbake til stillingen de vil rapportere etter logg inn
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/stilling${stringifyQueryObject({
            uuid: window.location.search.split("=")[1]
        })}`;
    } else if (path.startsWith(`${CONTEXT_PATH}/stilling/`)) {
        // 'stilling/:uuid' er ikke en allowedRedirectUrls url, så vi må mappe om til /stilling?uuid=<uuid>
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/stilling${stringifyQueryObject({
            uuid: path.split(`${CONTEXT_PATH}/stilling/`)[1]
        })}`;
    } else if (path.startsWith(`${CONTEXT_PATH}/intern/`)) {
        // 'intern/:uuid' er ikke en allowedRedirectUrls url, så vi må mappe om til /intern?uuid=<uuid>
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/intern${stringifyQueryObject({
            uuid: path.split(`${CONTEXT_PATH}/intern/`)[1]
        })}`;
    } else if (path.startsWith(`${CONTEXT_PATH}/lagrede-sok`)) {
        const query = {};
        const uuid = extractParam("uuid");
        if (uuid !== null) query["uuid"] = uuid;
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/lagrede-sok${stringifyQueryObject(query)}`;
    } else if (path === CONTEXT_PATH) {
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}${window.location.search}`;
    } else if (allowedRedirectUrls.includes(path)) {
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/${path.split(`${CONTEXT_PATH}/`)[1]}`;
    } else {
        redirectUrlAfterSuccessfulLogin = STILLINGSOK_URL;
    }
    return `${LOGIN_URL}?level=Level3&redirect=${encodeURIComponent(redirectUrlAfterSuccessfulLogin)}`;
}

export function fixUrlAfterLogin() {
    // Om man logget inn mens man var inne på en stillingsannonse, så vil loginservice
    // redirecte til en url med dette url-formatet: '/stillinger/stilling?uuid=12345'.
    // Redirecter derfor til riktig url-format: '/stillinger/stilling/:uuid'
    if (window.location.pathname === `${CONTEXT_PATH}/stilling`) {
        const { uuid, ...otherQueryParams } = parseQueryString(document.location.search);
        window.history.replaceState(
            {},
            "",
            `${CONTEXT_PATH}/stilling/${uuid}${stringifyQueryObject(otherQueryParams)}`
        );
    } else if (window.location.pathname === `${CONTEXT_PATH}/intern`) {
        const { uuid, ...otherQueryParams } = parseQueryString(document.location.search);
        window.history.replaceState({}, "", `${CONTEXT_PATH}/intern/${uuid}${stringifyQueryObject(otherQueryParams)}`);
    }
}

const AuthenticationProvider = ({ children }) => {
    const [authenticationStatus, setAuthenticationStatus] = useState(AuthenticationStatus.NOT_FETCHED);
    const [userNameAndInfo, setUserNameAndInfo] = useState(false);

    useEffect(() => {
        fetchIsAuthenticated();
        fetchUserNameAndInfo();
    }, []);

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
            .catch(() => {
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
        window.location.href = getLoginUrl(window.location.pathname);
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
