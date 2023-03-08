import * as React from "react";
import { useState } from "react";
import { UAParser } from "ua-parser-js";
import NavFrontendModal from "nav-frontend-modal";
import { Button } from "@navikt/ds-react";
import { Element, Normaltekst, Systemtittel } from "nav-frontend-typografi";
import "./BrowserSupportInfo.css";

const BrowserSupportInfo = ({ tillatLukking = false }) => {
    const browserInfo = new UAParser(navigator.userAgent).getBrowser();
    if (
        browserInfo.name === "IE" &&
        (browserInfo.major === "11" ||
            browserInfo.major === "10" ||
            browserInfo.major === "9" ||
            browserInfo.major === "8" ||
            browserInfo.major === "7")
    ) {
        return <BrowserSupportInfoModal tillatLukking={tillatLukking} />;
    }
    return null;
};

const BrowserSupportInfoModal = ({ tillatLukking = false }) => {
    const [open, setOpen] = useState(true);
    const closeModal = () => {
        if (tillatLukking) {
            setOpen(false);
        }
    };
    return (
        <NavFrontendModal
            isOpen={open}
            contentLabel="Informasjon om støttede nettlesere"
            onRequestClose={closeModal}
            className="BrowserInfo"
            closeButton={tillatLukking}
        >
            <section>
                <Systemtittel className="BrowserInfo-header">
                    Du må bruke en annen nettleser enn Internet&nbsp;Explorer
                </Systemtittel>
                <Normaltekst className="BrowserInfo-paragraph">
                    Microsoft faser ut Internet Explorer. Du må laste ned en annen nettleser for å bruke
                    arbeidsplassen.no
                </Normaltekst>
                <Element tag="h3" className="BrowserInfo-subheader">
                    Last ned:
                </Element>
                <div className="BrowserInfo-lenkeliste">
                    <ul>
                        <li className="ForlateSiden">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.google.com/intl/no/chrome/"
                                className="link"
                            >
                                <span className="lenke">Google Chrome</span>
                                <i className="ForlateSiden__icon" />
                            </a>
                        </li>
                        <li className="ForlateSiden">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://www.mozilla.org/en-US/firefox/new/"
                                className="link"
                            >
                                <span className="lenke">Mozilla Firefox</span>
                                <i className="ForlateSiden__icon" />
                            </a>
                        </li>
                    </ul>
                </div>

                {tillatLukking && (
                    <Normaltekst className="BrowserInfo-knapp-wrapper">
                        <Button variant="secondary" onClick={closeModal}>Lukk</Button>
                    </Normaltekst>
                )}
            </section>
        </NavFrontendModal>
    );
};

export default BrowserSupportInfo;
