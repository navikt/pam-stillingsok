import React, { ReactNode, useEffect, useState } from "react";
import SessionStatusModal from "@/app/stillinger/_common/auth/components/SessionStatusModal";
import TimeoutLogoutModal from "@/app/stillinger/_common/auth/components/TimeoutLogoutModal";
import * as actions from "@/app/stillinger/_common/actions/index";
import { deleteCookie } from "@/app/_common/actions/cookies";
import { usePathname } from "next/navigation";
import { broadcastLogin, broadcastLogout, listenForAuthEvents } from "@/app/_common/broadcast/auth";

const browserTabId = Math.random().toString(36).substring(2, 15);

type UserNameAndInfo =
    | false
    | {
          erUnderFemten: boolean;
          kanLoggePaa: boolean;
          navn: string;
      };
interface AuthenticationContextType {
    userNameAndInfo: UserNameAndInfo;

    authenticationStatus: string | undefined;
    login: () => void;
    logout: () => void;
    loginAndRedirect: (navigateTo: string) => void;
}
export const AuthenticationContext = React.createContext<AuthenticationContextType>({
    userNameAndInfo: false,
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

const PATHNAMES_TO_REDIRECT_LOGOUT = ["/min-side", "/stillinger/lagrede-sok", "/stillinger/favoritter"];

type AuthenticationProviderProps = {
    children: ReactNode;
};
function AuthenticationProvider({ children }: AuthenticationProviderProps) {
    const [authenticationStatus, setAuthenticationStatus] = useState(AuthenticationStatus.NOT_FETCHED);
    const [userNameAndInfo, setUserNameAndInfo] = useState<UserNameAndInfo>(false);
    const [hasBeenLoggedIn, setHasBeenLoggedIn] = useState(false);
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);
    const pathname = usePathname();

    const timeoutLogout = () => {
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
        // Logout and redirect if on a page that requires auth, if not only show logged out modal
        if (PATHNAMES_TO_REDIRECT_LOGOUT.includes(pathname)) {
            window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
        } else {
            setShowTimeoutModal(true);
            fetch("/oauth2/logout", {
                credentials: "include",
            }).catch(() => {});
        }
    };

    const markAsLoggedOut = () => {
        void deleteCookie("organizationNumber");
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
    };

    function login() {
        // Redirect to front page if logging in from the /utlogget page
        if (window.location.pathname === "/utlogget") {
            window.location.href = `/oauth2/login?redirect=${encodeURIComponent("/")}`;
        } else {
            window.location.href = `/oauth2/login?redirect=${encodeURIComponent(window.location.href)}`;
        }
    }

    function loginAndRedirect(navigateTo: string) {
        window.location.href = `/oauth2/login?redirect=${encodeURIComponent(navigateTo)}`;
    }

    function logout() {
        void deleteCookie("organizationNumber");
        broadcastLogout({ browserTabId });
        window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/utlogget")}`;
    }

    const fetchIsAuthenticated = async () => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);
        let validation;

        try {
            validation = await actions.checkIfAuthenticated();
        } catch (err) {
            setAuthenticationStatus(AuthenticationStatus.FAILURE);
            return;
        }

        if (validation?.isAuthenticated) {
            setAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED);
            setHasBeenLoggedIn(true);
        } else if (validation?.failure || !validation) {
            setAuthenticationStatus(AuthenticationStatus.FAILURE);
        } else {
            setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
            if (hasBeenLoggedIn) {
                setHasBeenLoggedIn(false);
                timeoutLogout();
            }
        }
    };

    async function fetchUserNameAndInfo() {
        let isSuccess;
        let result;
        try {
            result = await actions.getPersonalia();
            isSuccess = result.success;
        } catch (err) {
            isSuccess = false;
        }

        if (isSuccess) {
            setUserNameAndInfo(result?.data);
            broadcastLogin();
        }
    }

    useEffect(() => {
        void fetchIsAuthenticated();

        const authEvents = listenForAuthEvents((event) => {
            // Don`t listen for events triggered by current browser tab
            if (event.browserTabId === browserTabId) {
                return;
            }

            if (event.type === "USER_LOGGED_IN") {
                setShowTimeoutModal(false);
                setAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED);
            }
            if (event.type === "USER_LOGGED_OUT") {
                timeoutLogout();
            }
        });
        return authEvents;
    }, []);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            void fetchUserNameAndInfo();
        }
    }, [authenticationStatus]);

    if (showTimeoutModal) {
        return (
            <AuthenticationContext.Provider
                value={{ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }}
            >
                <TimeoutLogoutModal onClose={() => setShowTimeoutModal(false)} />
                {children}
            </AuthenticationContext.Provider>
        );
    }

    return (
        <AuthenticationContext.Provider
            value={{ userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect }}
        >
            <SessionStatusModal
                markAsLoggedOut={markAsLoggedOut}
                login={login}
                logout={logout}
                timeoutLogout={timeoutLogout}
            />
            {children}
        </AuthenticationContext.Provider>
    );
}

export default AuthenticationProvider;
