import React, { ReactNode, useEffect, useState } from "react";
import SessionStatusModal from "@/app/stillinger/_common/auth/components/SessionStatusModal";
import * as actions from "@/app/stillinger/_common/actions/index";
import { deleteCookie } from "@/app/_common/actions/cookies";

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

type AuthenticationProviderProps = {
    children: ReactNode;
};
function AuthenticationProvider({ children }: AuthenticationProviderProps) {
    const [authenticationStatus, setAuthenticationStatus] = useState(AuthenticationStatus.NOT_FETCHED);
    const [userNameAndInfo, setUserNameAndInfo] = useState<UserNameAndInfo>(false);
    const [hasBeenLoggedIn, setHasBeenLoggedIn] = useState(false);

    const timeoutLogout = () => {
        window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
    };
    const markAsLoggedOut = () => {
        deleteCookie("organizationNumber");
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
        deleteCookie("organizationNumber");
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
