import React, { useContext } from "react";
import { AuthenticationContext, AuthenticationStatus } from "@/app/min-side/_common/contexts/AuthenticationProvider";
import { Header } from "@navikt/arbeidsplassen-react";
/** TODO: konverter til ts*/
function MinSideHeader() {
    const { authenticationStatus, logout } = useContext(AuthenticationContext);

    let authStatus = "unknown";
    if (authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED) {
        authStatus = "is-authenticated";
    } else if (authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED) {
        authStatus = "not-authenticated";
    }

    return <Header variant="person" authenticationStatus={authStatus} onLogin={() => {}} onLogout={logout} />;
}

export default MinSideHeader;
