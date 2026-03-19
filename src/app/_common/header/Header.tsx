"use client";

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
    MuligheterAccessStatus,
} from "@/app/stillinger/_common/auth/contexts/AuthenticationProvider";
import { PageBlock } from "@navikt/ds-react/Page";

type ArbeidsplassenMuligheterAccessStatus = "no-access" | "has-access";

export function getActiveMenuItem(pathname: string): Active | undefined {
    if (pathname === "/sommerjobb") {
        return "sommerjobb";
    } else if (pathname.startsWith("/ung")) {
        return "ung";
    } else if (pathname.startsWith("/stillinger")) {
        return "ledige-stillinger";
    } else if (pathname.startsWith("/muligheter")) {
        return "muligheter";
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

export function getMuligheterAccessStatus(
    muligheterAccessStatus: string | undefined,
): ArbeidsplassenMuligheterAccessStatus {
    if (muligheterAccessStatus === MuligheterAccessStatus.MULIGHETER_ACCESS_OK) {
        return "has-access";
    }

    return "no-access";
}

export function getHeaderVariant(currentPath: string) {
    return COMPANY_PATHS.includes(currentPath) ? "company" : "person";
}

export default function Header() {
    const currentPath = usePathname();
    const { authenticationStatus, muligheterAccessStatus, login, logout } = useContext(AuthenticationContext);

    return (
        <PageBlock width="2xl" gutters>
            <ArbeidsplassenHeader
                variant={getHeaderVariant(currentPath)}
                active={getActiveMenuItem(currentPath)}
                authenticationStatus={getHeaderAuthenticationStatus(authenticationStatus)}
                muligheterAccessStatus={getMuligheterAccessStatus(muligheterAccessStatus)}
                onLogin={login}
                onLogout={logout}
            />
        </PageBlock>
    );
}
