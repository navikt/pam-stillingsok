import React, { useEffect, useState, ReactNode } from "react";
import SessionStatusModal from "@/app/min-side/_common/components/auth/SessionStatusModal";

export const AuthenticationStatus = {
    NOT_FETCHED: "NO_FETCHED",
    IS_FETCHING: "IS_FETCHING",
    NOT_AUTHENTICATED: "IS_NOT_AUTHENTICATED",
    IS_AUTHENTICATED: "IS_AUTHENTICATED",
    FAILURE: "FAILURE",
} as const;

type AuthenticationStatusType = (typeof AuthenticationStatus)[keyof typeof AuthenticationStatus];

interface AuthenticationContextType {
    authenticationStatus: AuthenticationStatusType;
    logout: () => void;
}

export const AuthenticationContext = React.createContext<AuthenticationContextType | undefined>(undefined);

interface AuthenticationProviderProps {
    children: ReactNode;
}

function AuthenticationProvider({ children }: AuthenticationProviderProps) {
    const [authenticationStatus, setAuthenticationStatus] = useState<AuthenticationStatusType>(
        AuthenticationStatus.NOT_FETCHED,
    );
    const [hasBeenLoggedIn, setHasBeenLoggedIn] = useState(false);

    const logout = (): void => {
        window.location.href = `/min-side/oauth2/logout?redirect=/utlogget`;
    };

    const timeoutLogout = (): void => {
        window.location.href = `/min-side/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
    };

    const login = (): void => {
        window.location.href = `/min-side/oauth2/login?redirect=${encodeURIComponent(window.location.href)}`;
    };

    const markAsLoggedOut = (): void => {
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
    };

    const fetchIsAuthenticated = (): void => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);

        fetch(`/min-side/api/isAuthenticated`, {
            credentials: "include",
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

    useEffect(() => {
        fetchIsAuthenticated();
    }, []);

    const contextValue = React.useMemo(
        () => ({
            authenticationStatus,
            logout,
        }),
        [authenticationStatus],
    );

    return (
        <AuthenticationContext.Provider value={contextValue}>
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
