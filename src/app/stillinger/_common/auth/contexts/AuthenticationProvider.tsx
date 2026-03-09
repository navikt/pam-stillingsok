"use client";

import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import SessionStatusModal from "@/app/stillinger/_common/auth/components/SessionStatusModal";
import TimeoutLogoutModal from "@/app/stillinger/_common/auth/components/TimeoutLogoutModal";
import { usePathname } from "next/navigation";
import { broadcastLogin, broadcastLogout, listenForAuthEvents } from "@/app/_common/broadcast/auth";
import { fetchAuthStatusWithGuards, resetAuthStatusCache } from "@/app/_common/auth/apiClient";
//import { fetchAuthStatus } from "@/app/_common/auth/apiClient";
import { fetchPersonalia } from "@/app/_common/auth/aduserClient";
import { fetchMuligheterAccessStatus } from "@/app/muligheter/_common/auth/apiClient";

type UserNameAndInfo =
    | false
    | {
          erUnderFemten: boolean;
          kanLoggePaa: boolean;
          navn: string;
      };
interface AuthenticationContextType {
    userNameAndInfo: UserNameAndInfo;
    authenticationStatus: AuthenticationStatusValue | undefined;
    muligheterAccessStatus: MuligheterAccessStatusValue | undefined;
    login: () => void;
    logout: () => void;
    loginAndRedirect: (navigateTo: string) => void;
}
export const AuthenticationContext = React.createContext<AuthenticationContextType>({
    userNameAndInfo: false,
    authenticationStatus: undefined,
    muligheterAccessStatus: undefined,
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
} as const;

type AuthenticationStatusValue = (typeof AuthenticationStatus)[keyof typeof AuthenticationStatus];

export const MuligheterAccessStatus = {
    NOT_FETCHED: "NOT_FETCHED",
    IS_FETCHING: "IS_FETCHING",
    MULIGHETER_NO_ACCESS: "MULIGHETER_NO_ACCESS",
    MULIGHETER_ACCESS_OK: "MULIGHETER_ACCESS_OK",
    FAILURE: "FAILURE",
} as const;

type MuligheterAccessStatusValue = (typeof MuligheterAccessStatus)[keyof typeof MuligheterAccessStatus];

const PATHNAMES_TO_REDIRECT_LOGOUT = ["/min-side", "/stillinger/lagrede-sok", "/stillinger/favoritter"];

type AuthenticationProviderProps = {
    children: ReactNode;
};
function AuthenticationProvider({ children }: AuthenticationProviderProps) {
    const [authenticationStatus, setAuthenticationStatus] = useState<AuthenticationStatusValue>(
        AuthenticationStatus.NOT_FETCHED,
    );
    const [muligheterAccessStatus, setMuligheterAccessStatus] = useState<MuligheterAccessStatusValue>(
        MuligheterAccessStatus.NOT_FETCHED,
    );
    const [userNameAndInfo, setUserNameAndInfo] = useState<UserNameAndInfo>(false);
    const [showTimeoutModal, setShowTimeoutModal] = useState(false);
    const pathname = usePathname();

    const pathnameRef = useRef(pathname);
    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    const hasBeenLoggedInRef = useRef(false);

    const browserTabIdRef = useRef<string>(Math.random().toString(36).substring(2, 15));

    const deleteOrganizationCookie = useCallback((): void => {
        void fetch("/api/cookies/organizationNumber", { method: "DELETE" }).catch(() => {});
    }, []);

    const timeoutLogout = useCallback((): void => {
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);

        const currentPathname = pathnameRef.current;
        if (PATHNAMES_TO_REDIRECT_LOGOUT.includes(currentPathname)) {
            window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/utlogget?timeout=true")}`;
            return;
        }

        setShowTimeoutModal(true);
        fetch("/oauth2/logout", { credentials: "include" }).catch(() => {});
    }, []);

    const markAsLoggedOut = useCallback((): void => {
        deleteOrganizationCookie();
        setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);
    }, [deleteOrganizationCookie]);

    const login = useCallback((): void => {
        const redirectTo = window.location.pathname === "/utlogget" ? "/" : window.location.href;
        window.location.href = `/oauth2/login?redirect=${encodeURIComponent(redirectTo)}`;
    }, []);

    const loginAndRedirect = useCallback((navigateTo: string): void => {
        window.location.href = `/oauth2/login?redirect=${encodeURIComponent(navigateTo)}`;
    }, []);

    const logout = useCallback((): void => {
        deleteOrganizationCookie();
        broadcastLogout({ browserTabId: browserTabIdRef.current });
        window.location.href = `/oauth2/logout?redirect=${encodeURIComponent("/utlogget")}`;
    }, [deleteOrganizationCookie]);

    const fetchIsAuthenticated = useCallback(async (): Promise<void> => {
        setAuthenticationStatus(AuthenticationStatus.IS_FETCHING);

        try {
            const validation = await fetchAuthStatusWithGuards();

            if (!validation.ok) {
                setAuthenticationStatus(AuthenticationStatus.FAILURE);
                return;
            }

            if (validation.isAuthenticated) {
                setAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED);
                hasBeenLoggedInRef.current = true;
                return;
            }

            setAuthenticationStatus(AuthenticationStatus.NOT_AUTHENTICATED);

            if (hasBeenLoggedInRef.current) {
                hasBeenLoggedInRef.current = false;
                timeoutLogout();
            }
        } catch {
            setAuthenticationStatus(AuthenticationStatus.FAILURE);
        }
    }, [timeoutLogout]);

    const fetchHasMuligheterAccess = async () => {
        setMuligheterAccessStatus(MuligheterAccessStatus.IS_FETCHING);
        let validation;

        try {
            validation = await fetchMuligheterAccessStatus();
        } catch {
            setMuligheterAccessStatus(MuligheterAccessStatus.FAILURE);
            return;
        }

        if (validation?.hasMuligheterAccess) {
            setMuligheterAccessStatus(MuligheterAccessStatus.MULIGHETER_ACCESS_OK);
        } else if (validation?.failure || !validation) {
            setMuligheterAccessStatus(MuligheterAccessStatus.FAILURE);
        } else {
            setMuligheterAccessStatus(MuligheterAccessStatus.MULIGHETER_NO_ACCESS);
        }
    };

    const fetchUserNameAndInfo = useCallback(async (): Promise<void> => {
        try {
            const result = await fetchPersonalia();
            if (result.success) {
                setUserNameAndInfo(result.data);
                broadcastLogin();
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        void fetchIsAuthenticated();

        const stopListening = listenForAuthEvents((event) => {
            if (event.browserTabId === browserTabIdRef.current) {
                return;
            }

            if (event.type === "USER_LOGGED_IN") {
                resetAuthStatusCache();
                setShowTimeoutModal(false);
                setAuthenticationStatus(AuthenticationStatus.IS_AUTHENTICATED);
            } else if (event.type === "USER_LOGGED_OUT") {
                resetAuthStatusCache();
                timeoutLogout();
            }
        });

        return stopListening;
    }, [fetchIsAuthenticated, timeoutLogout]);

    useEffect(() => {
        if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
            void fetchUserNameAndInfo();
            void fetchHasMuligheterAccess();
        }
    }, [authenticationStatus, fetchUserNameAndInfo]);

    const contextValue = useMemo<AuthenticationContextType>(() => {
        return {
            userNameAndInfo,
            authenticationStatus,
            muligheterAccessStatus,
            login,
            logout,
            loginAndRedirect,
        };
    }, [userNameAndInfo, authenticationStatus, login, logout, loginAndRedirect]);

    if (showTimeoutModal) {
        return (
            <AuthenticationContext.Provider value={contextValue}>
                <TimeoutLogoutModal onClose={() => setShowTimeoutModal(false)} />
                {children}
            </AuthenticationContext.Provider>
        );
    }
    return (
        <AuthenticationContext.Provider value={contextValue}>
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
