import React, { ReactNode, useEffect, useState } from "react";
import SessionStatusModal from "@/app/stillinger/_common/auth/components/SessionStatusModal";
import TimeoutLogoutModal from "@/app/stillinger/_common/auth/components/TimeoutLogoutModal";
import * as actions from "@/app/stillinger/_common/actions/index";
import { deleteCookie } from "@/app/_common/actions/cookies";
import { usePathname } from "next/navigation";

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
        // Logout and redirect if on a page that requires auth, if not only show logged out modal
        if (PATHNAMES_TO_REDIRECT_LOGOUT.includes(pathname)) {
            window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
        } else {
            setShowTimeoutModal(true);
            setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
        }
    };

    const markAsLoggedOut = () => {
        void deleteCookie("organizationNumber");
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
    };

    function login() {
        // Redirect to front pagt if logging in from the /utlogget page
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
        }
    }

    useEffect(() => {
        void fetchIsAuthenticated();
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

export default AuthenticationProvider;
