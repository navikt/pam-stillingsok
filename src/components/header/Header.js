import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AuthenticationContext, AuthenticationStatus } from "../../context/AuthenticationProvider";
import "./Header.less";

const Header = () => {
    const { authenticationStatus, login, logout, userNameAndInfo } = useContext(AuthenticationContext);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const header = document.getElementById("arbeidsplassen-header-menu");
        header.className = showMobileMenu ? "" : "arbeidsplassen-header-menu-hidden";
    }, [showMobileMenu]);

    return (
        <React.Fragment>
            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                <React.Fragment>
                    {ReactDOM.createPortal(
                        <button onClick={logout}>Logg ut</button>,
                        document.getElementById("arbeidsplassen-header-login-container")
                    )}
                    {ReactDOM.createPortal(
                        <a href="/personinnstillinger" className="arbeidsplassen-header-settings-link">
                            Innstillinger
                        </a>,
                        document.getElementById('arbeidsplassen-header-settings-container')
                    )}
                    {ReactDOM.createPortal(
                        <React.Fragment>
                            {userNameAndInfo && userNameAndInfo.fornavn && userNameAndInfo.etternavn
                                ? userNameAndInfo.fornavn + " " + userNameAndInfo.etternavn
                                : ""}
                        </React.Fragment>,
                        document.getElementById("arbeidsplassen-header-current-user-container")
                    )}
                </React.Fragment>
            )}
            {authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && (
                <React.Fragment>
                    {ReactDOM.createPortal(
                        <button onClick={login}>Logg inn</button>,
                        document.getElementById("arbeidsplassen-header-login-container")
                    )}
                </React.Fragment>
            )}
            {ReactDOM.createPortal(
                <button
                    aria-expanded={showMobileMenu}
                    aria-controls="arbeidsplassen-header-menu-wrapper"
                    onClick={() => {
                        setShowMobileMenu(!showMobileMenu);
                    }}
                >
                    Meny
                </button>,
                document.getElementById("arbeidsplassen-header-menu-button-container")
            )}
        </React.Fragment>
    );
};

export default Header;
