import React from "react";
import * as ReactDOMClient from "react-dom/client";
import "@navikt/ds-css/dist/global/tokens.css";
import "@navikt/ds-css/dist/global/reset.css";
import "@navikt/ds-css/dist/global/baseline.css";
import "@navikt/ds-css/dist/global/print.css";
import "@navikt/ds-css/dist/components.css";
import "@navikt/arbeidsplassen-css";
import "@navikt/arbeidsplassen-theme";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AuthenticationProvider from "./app/_common/auth/contexts/AuthenticationProvider";
import UserProvider from "./app/_common/user/UserProvider";
import FavouritesProvider from "./app/stillinger/favoritter/_components/FavouritesProvider";
import Header from "./app/_common/components/header/Header";
import { CONTEXT_PATH } from "./app/_common/environment";
import initSentry from "./app/_common/tracking/sentry";
import { initAmplitude } from "./app/_common/tracking/amplitude";
import SearchPage from "./modules/sok/page";
import SuperraskPage from "./modules/stilling/superrask-soknad/page";
import AdPage from "./modules/stilling/page";
import ReportAdPage from "./modules/stilling/rapporter-annonse/page";
import FavouritesPage from "./modules/favoritter/page";
import SavedSearchesPage from "./modules/lagrede-sok/page";
import WithdrawApplicationPage from "./modules/stilling/trekk-soknad/page";
import "./app/styles.css";
import googleTranslateWorkaround from "./app/_common/utils/googleTranslateWorkaround";

// todo flytt til App.jsx
initSentry();
initAmplitude();
googleTranslateWorkaround();

// todo slettes ?
function Application() {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>
                    <SkipLink href="#main-content" />
                    <div className="arb-push-footer-down">
                        <BrowserRouter>
                            <Switch>
                                <Route component={Header} />
                            </Switch>
                            <main id="main-content">
                                <Switch>
                                    <Route exact path={CONTEXT_PATH} component={SearchPage} />
                                    <Route
                                        path={`${CONTEXT_PATH}/stilling/:id/superrask-soknad`}
                                        component={SuperraskPage}
                                    />
                                    <Route path={`${CONTEXT_PATH}/stilling/:id`} component={AdPage} />
                                    <Route path={`${CONTEXT_PATH}/rapporter-annonse/:id`} component={ReportAdPage} />
                                    <Route path={`${CONTEXT_PATH}/favoritter`} component={FavouritesPage} />
                                    <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearchesPage} />
                                    <Route
                                        path={`${CONTEXT_PATH}/trekk-soknad/:uuid/:adUuid`}
                                        component={WithdrawApplicationPage}
                                    />
                                </Switch>
                            </main>
                        </BrowserRouter>
                    </div>
                    <Footer />
                </FavouritesProvider>
            </UserProvider>
        </AuthenticationProvider>
    );
}

const container = document.getElementById("app");
const root = ReactDOMClient.createRoot(container);
root.render(<Application />);
