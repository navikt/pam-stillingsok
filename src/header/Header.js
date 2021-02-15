import * as React from 'react';
import {useEffect, useState} from 'react';
import Popover from './popover/Popover';
import './Header.less';
import {InnstillingerLenkeMobil, Personbrukermeny} from './personbruker/Personbrukermeny';
import {AuthStatus} from "pam-frontend-header";
import {usePrevious} from "../common/hooks/usePrevious";
import NewCvLink from "./newCvLink/NewCvLink";
import Cookies from "universal-cookie";
import {Lenkeknapp, Knapp} from "@navikt/arbeidsplassen-knapper";
import SkipLink from "../common/components/SkipLink";

const AuthButton = ({label, onClick}) => (
    <Knapp onClick={onClick} className="Header__Button Header__Button--mini">
        {label}
    </Knapp>
);

const AktivitetsplanLenkeMobil = ({onNavigationClick}) => (
    <a
        href="https://aktivitetsplan.nav.no"
        className="Header__AktivitetsplanLenke"
        onClick={onNavigationClick('https://www.nav.no/person/dittnav')}
    >
        <div className="Header__AktivitetsplanLenke-inner">
            <span className="Header__AktivitetsplanLenke__text">Ditt NAV</span>
            <span className="Header__Lenkeikon"/>
        </div>
    </a>
);

const Header = ({
                    useMenu,
                    onLoginClick,
                    onLogoutClick,
                    applikasjon,
                    arbeidsgiverSelect,
                    authenticationStatus,
                    visInnstillinger,
                    validerNavigasjon,
                    role,
                    showName,
                }) => {

    const [showPopover, setShowPopover] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showNewCvLink, setShowNewCvLink] = useState(false);
    const [userInfo, setUserInfo] = useState(undefined);
    const [underOppfolging, setUnderOppfolging] = useState(false);

    const previousShowMobileMenu = usePrevious(showMobileMenu);
    const previousArbeidsgiverSelect = usePrevious(arbeidsgiverSelect);

    useEffect(() => {
        const cookies = new Cookies();
        setShowNewCvLink(cookies.get('useNewCv') !== 'true'
            && cookies.get('newCvRolloutGroup') === 'true');

        if (role) {
            localStorage.setItem('innloggetBrukerKontekst', role);
        }
        if (!userInfo) {
            if (process.env.NODE_ENV === 'production') {
                fetch('/api/cv/rest/person/headerinfo', {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then((response) => response.json())
                    .then((result) => {
                        setUserInfo(result);
                        setUnderOppfolging(result.underOppfolging || false);
                    });
            } else {
                setUserInfo({
                    underOppfolging: true,
                    fornavn: 'Navn',
                    etternavn: 'Navnesen'
                });
                setUnderOppfolging(true);
            }
        }
    }, []);

    useEffect(() => {
        if (previousArbeidsgiverSelect !== undefined &&
            previousShowMobileMenu !== undefined &&
            previousArbeidsgiverSelect === arbeidsgiverSelect &&
            previousShowMobileMenu
        ) {
            setShowMobileMenu(false);
        }
    }, [arbeidsgiverSelect, previousArbeidsgiverSelect, previousShowMobileMenu]);

    const onPopoverClose = () => {
        setShowPopover(false);
    };

    const onPopoverOpen = () => {
        setShowPopover(true);
    };

    const loginClick = (role) => () => {
        localStorage.setItem('innloggetBrukerKontekst', role);
        onLoginClick(role);
    };

    const logoutClick = () => {
        localStorage.removeItem('innloggetBrukerKontekst');
        onLogoutClick();
    };

    const onToggleMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const onNavigationClick = (url) => (e) => {
        if (validerNavigasjon && !validerNavigasjon.redirectTillates()) {
            e.preventDefault();
            validerNavigasjon.redirectForhindretCallback(url);
        }
    };

    return (
        <div className={`Header__wrapper${authenticationStatus === AuthStatus.IS_AUTHENTICATED ? ' Header__wrapper__border' : ''}`}>
            <SkipLink />
            <div className="Header">
                <div className="Header__topp">
                    <div className="Header__logo">
                        <a href="/" aria-label="Logo Arbeidsplassen">
                            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 40">
                                <path fill="#40c1ac" d="M15.9 0L0 40h174.1L190 0z"/>
                                <path fill="#062040"
                                      d="M24.4 15.2c1.7 0 2.8.8 3.5 1.9v-1.4c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2v7.9h.8c.2 0 .3.2.2.4l-.5 1.4c0 .1-.1.1-.2.1h-2.2c-.1 0-.2-.1-.2-.2v-1.4c-.7 1.2-1.9 1.9-3.5 1.9-2.6 0-4.8-2.4-4.8-5.3-.1-3 2.1-5.3 4.7-5.3zm.5 8.5c1.8 0 3-1.3 3-3.2 0-1.9-1.3-3.2-3-3.2-1.8 0-3 1.3-3 3.2 0 1.9 1.2 3.2 3 3.2zM33.5 25.2v-7.9h-.8c-.2 0-.3-.2-.2-.4l.5-1.4c0-.1.1-.1.2-.1h2.2c.1 0 .2.1.2.2v2c.8-1.4 2-2.4 3.8-2.5.1 0 .2.1.2.2v2c0 .1-.1.2-.2.2-2.6 0-3.8 1.4-3.8 3.2v4.4c0 .1-.1.2-.2.2h-1.8c0 .1-.1 0-.1-.1zM43.5 23.8v1.4c0 .1-.1.2-.2.2h-2.4c-.2 0-.3-.2-.2-.4l.7-1.7V11.7c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2v5.4c.7-1.2 1.9-1.9 3.5-1.9 2.6 0 4.8 2.3 4.8 5.3 0 2.9-2.2 5.3-4.8 5.3-1.7-.1-2.8-.8-3.6-2zm6.1-3.3c0-1.9-1.3-3.2-3-3.2-1.8 0-3 1.3-3 3.2 0 1.9 1.3 3.2 3 3.2 1.8 0 3-1.3 3-3.2zM58.6 15.2c2.5 0 4.8 1.9 4.8 5v.8c0 .1-.1.2-.2.2H56c.2 1.5 1.1 2.4 2.6 2.4 1 0 1.9-.1 2.3-.9 0-.1.1-.1.2-.1h1.8c.2 0 .3.1.2.3-.5 1.8-2.4 2.7-4.4 2.7-2.8 0-4.9-2.3-4.9-5.3 0-2.8 2-5.1 4.8-5.1zm2.6 4.2c0-1.4-1-2.2-2.5-2.2s-2.3.9-2.6 2.2h5.1zM65.1 12.2c0-.9.7-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7 0 .9-.8 1.7-1.7 1.7-1 0-1.7-.7-1.7-1.7zm.6 13v-9.5c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2v9.5c0 .1-.1.2-.2.2h-1.8c-.1 0-.2-.1-.2-.2zM74.9 15.2c1.7 0 2.8.8 3.5 1.9v-5.4c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2v11.9h.8c.2 0 .3.2.2.4l-.5 1.4c0 .1-.1.1-.2.1h-2.2c-.1 0-.2-.1-.2-.2v-1.4c-.7 1.2-1.9 1.9-3.5 1.9-2.6 0-4.8-2.3-4.8-5.3s2.1-5.3 4.7-5.3zm.5 8.5c1.8 0 3-1.3 3-3.2 0-1.9-1.3-3.2-3-3.2-1.8 0-3 1.3-3 3.2 0 1.9 1.2 3.2 3 3.2zM83.3 22.9c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2.2.6 1.2 1 2.4 1 1.4 0 2.3-.4 2.3-1.2 0-2.3-6.8.1-6.8-4.2 0-2 1.6-3.2 4.3-3.2 2.4 0 4.3 1.1 4.4 2.9 0 .1-.1.2-.2.2H90c-.1 0-.2-.1-.2-.2-.2-.7-1.1-1.1-2.2-1.1-1.3 0-2.1.4-2.1 1.3 0 2.1 6.9-.2 6.9 4.2 0 1.9-1.7 3.1-4.5 3.1-2.5 0-4.5-1.1-4.6-2.8zM100.7 25.7c-1.7 0-2.8-.8-3.5-1.9v5.4c0 .1-.1.2-.2.2h-1.8c-.1 0-.2-.1-.2-.2V17.3h-.8c-.2 0-.3-.2-.2-.4l.5-1.4c0-.1.1-.1.2-.1H97c.1 0 .2.1.2.2V17c.7-1.2 1.9-1.9 3.5-1.9 2.6 0 4.8 2.3 4.8 5.3s-2.1 5.3-4.8 5.3zm-.5-8.5c-1.8 0-3 1.3-3 3.2 0 1.9 1.3 3.2 3 3.2 1.8 0 3-1.3 3-3.2.1-1.8-1.2-3.2-3-3.2zM107.8 25.2V11.7c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2v13.5c0 .1-.1.2-.2.2H108c-.1 0-.2-.1-.2-.2zM117 15.2c1.7 0 2.8.8 3.5 1.9v-1.4c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2v7.9h.8c.2 0 .3.2.2.4l-.5 1.4c0 .1-.1.1-.2.1h-2.2c-.1 0-.2-.1-.2-.2v-1.4c-.7 1.2-1.9 1.9-3.5 1.9-2.6 0-4.8-2.4-4.8-5.3-.1-3 2-5.3 4.7-5.3zm.5 8.5c1.8 0 3-1.3 3-3.2 0-1.9-1.3-3.2-3-3.2-1.8 0-3 1.3-3 3.2-.1 1.9 1.2 3.2 3 3.2zM125.3 22.9c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2.2.6 1.2 1 2.4 1 1.4 0 2.3-.4 2.3-1.2 0-2.3-6.8.1-6.8-4.2 0-2 1.6-3.2 4.3-3.2 2.4 0 4.3 1.1 4.4 2.9 0 .1-.1.2-.2.2H132c-.1 0-.2-.1-.2-.2-.2-.7-1.1-1.1-2.2-1.1-1.3 0-2.1.4-2.1 1.3 0 2.1 6.9-.2 6.9 4.2 0 1.9-1.7 3.1-4.5 3.1-2.4 0-4.5-1.1-4.6-2.8zM136.4 22.9c0-.1.1-.2.2-.2h1.8c.1 0 .2.1.2.2.2.6 1.2 1 2.4 1 1.4 0 2.3-.4 2.3-1.2 0-2.3-6.8.1-6.8-4.2 0-2 1.6-3.2 4.3-3.2 2.4 0 4.3 1.1 4.4 2.9 0 .1-.1.2-.2.2h-1.9c-.1 0-.2-.1-.2-.2-.2-.7-1.1-1.1-2.2-1.1-1.3 0-2.1.4-2.1 1.3 0 2.1 6.9-.2 6.9 4.2 0 1.9-1.7 3.1-4.5 3.1-2.4 0-4.4-1.1-4.6-2.8zM152.5 15.2c2.5 0 4.8 1.9 4.8 5v.8c0 .1-.1.2-.2.2H150c.2 1.5 1.1 2.4 2.6 2.4 1 0 1.9-.1 2.3-.9 0-.1.1-.1.2-.1h1.8c.2 0 .3.1.2.3-.5 1.8-2.4 2.7-4.4 2.7-2.8 0-4.9-2.3-4.9-5.3-.2-2.8 1.9-5.1 4.7-5.1zm2.5 4.2c0-1.4-1-2.2-2.5-2.2s-2.3.9-2.6 2.2h5.1zM159.1 15.6c0-.1.1-.1.2-.1h2.2c.1 0 .2.1.2.2v1.6c.6-1.3 1.7-2.1 3.4-2.1 2.6 0 3.6 1.9 3.6 4.9v5.2c0 .1-.1.2-.2.2h-1.8c-.1 0-.2-.1-.2-.2v-5.2c0-2.3-1-2.8-2.3-2.8-1.8 0-2.6 1.3-2.6 3.2v4.8c0 .1-.1.2-.2.2h-1.8c-.1 0-.2-.1-.2-.2v-7.9h-.8c-.2 0-.3-.2-.2-.4l.7-1.4z"/>
                            </svg>
                        </a>
                    </div>
                    <div className="Header__Authentication">
                        {authenticationStatus === AuthStatus.UNKNOWN ? (
                            <div/>
                        ) : (
                            <div className="Header__Authentication__buttons">
                                {authenticationStatus === AuthStatus.IS_AUTHENTICATED ? (
                                    <div className="Header__Innstillinger__wrapper">
                                        {arbeidsgiverSelect && arbeidsgiverSelect}
                                        {!underOppfolging && showNewCvLink && <NewCvLink />}
                                        {underOppfolging &&
                                        <Lenkeknapp
                                            onClick={onNavigationClick("https://www.nav.no/person/dittnav")}
                                            className="Header__AktivitetsplanLenke"
                                        >
                                            <div className="Header__AktivitetsplanLenke-inner">
                                                    <span
                                                        className="Header__AktivitetsplanLenke__text">Ditt NAV</span>
                                                <span className="Header__Lenkeikon"/>
                                            </div>
                                        </Lenkeknapp>
                                        }
                                        {visInnstillinger && (
                                            <div>
                                                <Lenkeknapp
                                                    onClick={onNavigationClick('/personinnstillinger')}
                                                    className="Header__Innstillinger typo-normal"
                                                >
                                                    <div className="Header__Innstillinger-inner">
                                                            <span
                                                                className="Header__Innstillinger__text">Innstillinger</span>
                                                        <span className="Header__Tannhjul"/>
                                                    </div>
                                                </Lenkeknapp>
                                            </div>
                                        )}
                                        {userInfo && (
                                            <div className="Header__name">
                                                {userInfo.fornavn + " " + userInfo.etternavn}
                                            </div>
                                        )}
                                        <div className={userInfo ? 'Header__logout-name' : ''}>
                                            <AuthButton label="Logg ut" onClick={logoutClick}/>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="Header__VelgRolle">
                                            <button
                                                onClick={onPopoverOpen}
                                                className="Header__Button Header__Button--mini"
                                                aria-haspopup="true"
                                                aria-expanded={showPopover}
                                            >
                                                Logg inn
                                            </button>
                                            {showPopover && (
                                                <Popover onClose={onPopoverClose}>
                                                    <button
                                                        onClick={loginClick('personbruker')}
                                                        className="Header__VelgRolle__row"
                                                        aria-label="Logg inn som privatperson"
                                                    >
                                                        <div>For privatperson</div>
                                                        <div className="Login__Icon"/>
                                                    </button>
                                                    <div className="border--solid"/>
                                                    <button
                                                        onClick={loginClick('arbeidsgiver')}
                                                        className="Header__VelgRolle__row"
                                                        aria-label="Logg inn som arbeidsgiver"
                                                    >
                                                        <div>For arbeidsgivere</div>
                                                        <div className="Login__Icon"/>
                                                    </button>
                                                </Popover>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {authenticationStatus !== AuthStatus.UNKNOWN && (
                        <div className="Header__Authentication--mobile">
                            {authenticationStatus === AuthStatus.IS_AUTHENTICATED ? (
                                showMobileMenu ? (
                                    <button
                                        onClick={onToggleMenu}
                                        id="Mobilmeny__Button--toggle"
                                        className="Mobilmeny__Button--toggle"
                                        aria-expanded={true}
                                        aria-controls="Mobilmeny"
                                    >
                                        <div className="Mobilmeny--lukk-wrapper">
                                            <div className="Mobilmeny--lukk"/>
                                        </div>
                                        <span className="Mobilmeny__Text--toggle">Lukk</span>
                                    </button>
                                ) : (
                                    <button
                                        role="button"
                                        onClick={onToggleMenu}
                                        id="Mobilmeny__Button--toggle"
                                        className="Mobilmeny__Button--toggle"
                                        aria-expanded={false}
                                        aria-controls="Mobilmeny"
                                    >
                                        <div className="Mobilmeny--apne"/>
                                        <span className="Mobilmeny__Text--toggle">Meny</span>
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={onToggleMenu}
                                    className="Header__login--mobile Header__Button Header__Button--mini Header__Button--flat"
                                >
                                    Logg inn
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {authenticationStatus !== AuthStatus.UNKNOWN && showMobileMenu && (
                    <div className="Headermenu__mobile">
                        {authenticationStatus === AuthStatus.IS_AUTHENTICATED ? (
                            <div>
                                {useMenu !== 'none' && (
                                    <div className="Menu__wrapper__mobile">
                                        <Personbrukermeny
                                            applikasjon={applikasjon}
                                            validerNavigasjon={validerNavigasjon}
                                            onNavigationClick={onNavigationClick}
                                            underOppfolging={underOppfolging}
                                        />
                                    </div>
                                )}
                                {useMenu === 'none' && visInnstillinger && (
                                    <InnstillingerLenkeMobil
                                        applikasjon={applikasjon}
                                        onNavigationClick={onNavigationClick}
                                    />
                                )}
                                <div className="Header__Authentication__logout">
                                    {underOppfolging &&
                                    <AktivitetsplanLenkeMobil onNavigationClick={onNavigationClick}/>}
                                    <div className="Header__name__wrapper">
                                        {userInfo && (
                                            <div className="Header__name">
                                                {userInfo.fornavn + " " + userInfo.etternavn}
                                            </div>
                                        )}
                                        <div className={userInfo ? 'Header__logout-name' : ''}>
                                            <AuthButton label="Logg ut" onClick={logoutClick}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="Header__VelgRolle">
                                <button
                                    onClick={loginClick('personbruker')}
                                    className="Header__VelgRolle__row"
                                    aria-label="Logg inn som privatperson"
                                >
                                    <div>For privatperson</div>
                                    <div className="Login__Icon"/>
                                </button>
                                <div className="border--solid"/>
                                <button
                                    onClick={loginClick('arbeidsgiver')}
                                    className="Header__VelgRolle__row"
                                    aria-label="Logg inn som arbeidsgiver"
                                >
                                    <div>For arbeidsgivere</div>
                                    <div className="Login__Icon"/>
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {authenticationStatus === AuthStatus.IS_AUTHENTICATED && useMenu !== 'none' && (
                    <div className="Menu__wrapper">
                        <Personbrukermeny
                            applikasjon={applikasjon}
                            validerNavigasjon={validerNavigasjon}
                            onNavigationClick={onNavigationClick}
                            underOppfolging={underOppfolging}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
