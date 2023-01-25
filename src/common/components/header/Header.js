import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AuthenticationContext, AuthenticationStatus } from "../../../modules/auth/contexts/AuthenticationProvider";
import "./Header.less";

const Header = () => {
    const { authenticationStatus, login, logout, userNameAndInfo } = useContext(AuthenticationContext);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const header = document.getElementById("dsa-header-menu");
        header.className = showMobileMenu ? "" : "dsa-header-menu-hidden";
    }, [showMobileMenu]);

    return (
        <React.Fragment>
            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                <React.Fragment>
                    {ReactDOM.createPortal(
                        <button onClick={logout}>Logg ut</button>,
                        document.getElementById("dsa-header-login-container")
                    )}
                    {ReactDOM.createPortal(
                        <a href="/personinnstillinger" className="dsa-header-settings-link">
                            Innstillinger
                        </a>,
                        document.getElementById("dsa-header-settings-container")
                    )}
                    {ReactDOM.createPortal(
                        <React.Fragment>
                            {userNameAndInfo && userNameAndInfo.fornavn && userNameAndInfo.etternavn
                                ? userNameAndInfo.fornavn + " " + userNameAndInfo.etternavn
                                : ""}
                        </React.Fragment>,
                        document.getElementById("dsa-header-current-user-container")
                    )}
                </React.Fragment>
            )}
            {authenticationStatus === AuthenticationStatus.NOT_AUTHENTICATED && (
                <React.Fragment>
                    {ReactDOM.createPortal(
                        <button onClick={login}>Logg inn</button>,
                        document.getElementById("dsa-header-login-container")
                    )}
                </React.Fragment>
            )}
            {ReactDOM.createPortal(
                <button
                    aria-expanded={showMobileMenu}
                    aria-controls="dsa-header-menu-wrapper"
                    onClick={() => {
                        setShowMobileMenu(!showMobileMenu);
                    }}
                >
                    Meny
                </button>,
                document.getElementById("dsa-header-menu-button-container")
            )}
        </React.Fragment>
    );
};

export default Header;
