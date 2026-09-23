"use client";

import {
    type Active,
    type AuthenticationStatus as ArbeidsplassenAuthenticationStatus,
    Header as ArbeidsplassenHeader,
} from "@navikt/arbeidsplassen-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import COMPANY_PATHS from "@/app/_common/header/companyPaths";
import {
    AuthenticationContext,
    AuthenticationStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";

export function getActiveMenuItem(pathname: string): Active | undefined {
    if (pathname === "/sommerjobb") {
        return "sommerjobb";
    } else if (pathname.startsWith("/ung")) {
        return "ung";
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
    return COMPANY_PATHS.includes(currentPath) ? "company" : "person";
}

export default function Header() {
    const currentPath = usePathname();
    const { authenticationStatus, login, logout } = useContext(AuthenticationContext);

    return (
        <PageBlock width="2xl" gutters>
            <ArbeidsplassenHeader
                variant={getHeaderVariant(currentPath)}
                active={getActiveMenuItem(currentPath)}
                authenticationStatus={getHeaderAuthenticationStatus(authenticationStatus)}
                onLogin={login}
                onLogout={logout}
            />
        </PageBlock>
    );
}
