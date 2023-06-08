import React, { useContext } from "react";
import { Header as ArbeidsplassenHeader } from "@navikt/arbeidsplassen-react";
import { AuthenticationContext, AuthenticationStatus } from "../auth/contexts/AuthenticationProvider";

function Header() {
    const { authenticationStatus, login, logout, userNameAndInfo } = useContext(AuthenticationContext);

    const userName =
        userNameAndInfo && userNameAndInfo.fornavn && userNameAndInfo.etternavn
            ? `${userNameAndInfo.fornavn} ${userNameAndInfo.etternavn}`
            : "";

    let authStatus = "unknown";
    if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
        authStatus = "is-authenticated";
    } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
        authStatus = "not-authenticated";
    }

    return (
        <ArbeidsplassenHeader
            variant="person"
            active="ledige-stillinger"
            authenticationStatus={authStatus}
            onLogin={login}
            onLogout={logout}
            userName={userName}
        />
    );
}

export default Header;
