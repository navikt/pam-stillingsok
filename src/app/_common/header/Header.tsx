import React, { useContext } from "react";
import {
    Active,
    AuthenticationStatus as ArbeidsplassenAuthenticationStatus,
    Header as ArbeidsplassenHeader,
} from "@navikt/arbeidsplassen-react";
import COMPANY_PATHS from "@/app/_common/header/companyPaths";
import { usePathname } from "next/navigation";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";

export function getActiveMenuItem(pathname: string): Active | undefined {
    if (pathname === "/sommerjobb") {
        return "sommerjobb";
    } else if (pathname.startsWith("/stillinger")) {
        return "ledige-stillinger";
    }
    return undefined;
}

export function getHeaderAuthenticationStatus(
    authenticationStatus: string | undefined,
): ArbeidsplassenAuthenticationStatus {
    if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
        return "is-authenticated";
    } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
        return "not-authenticated";
    }
    return "unknown";
}

export function getHeaderVariant(currentPath: string) {
    const headerVariant = COMPANY_PATHS.includes(currentPath) ? "company" : "person";
    return headerVariant;
}

export default function Header() {
    const currentPath = usePathname();
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);

    return (
        <ArbeidsplassenHeader
            variant={getHeaderVariant(currentPath)}
            active={getActiveMenuItem(currentPath)}
            authenticationStatus={getHeaderAuthenticationStatus(authenticationStatus)}
            onLogin={login}
            onLogout={logout}
        />
    );
}
