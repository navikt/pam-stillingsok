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
import AuthenticationProvider from "./modules/common/auth/contexts/AuthenticationProvider";
import UserProvider from "./modules/common/user/UserProvider";
import FavouritesProvider from "./modules/favoritter/context/FavouritesProvider";
import Header from "./modules/common/components/header/Header";
import { CONTEXT_PATH } from "./modules/common/environment";
import initSentry from "./modules/common/tracking/sentry";
import { initAmplitude } from "./modules/common/tracking/amplitude";
import HistoryProvider from "./modules/common/context/HistoryProvider";
import SearchPage from "./modules/sok/page";
import SuperraskPage from "./modules/stilling/superrask-soknad/page";
import AdPage from "./modules/stilling/page";
import ReportAdPage from "./modules/stilling/rapporter-annonse/page";
import FavouritesPage from "./modules/favoritter/page";
import SavedSearchesPage from "./modules/lagrede-sok/page";
import WithdrawApplicationPage from "./modules/stilling/trekk-soknad/page";
import "./modules/styles.css";
import googleTranslateWorkaround from "./modules/common/utils/googleTranslateWorkaround";
import NotFound from "./modules/not-found";

initSentry();
initAmplitude();
googleTranslateWorkaround();

function Application() {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>
                    <SkipLink href="#main-content" />
                    <div className="arb-push-footer-down">
                        <BrowserRouter>
                            <HistoryProvider>
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
                                        <Route
                                            path={`${CONTEXT_PATH}/rapporter-annonse/:id`}
                                            component={ReportAdPage}
                                        />
                                        <Route path={`${CONTEXT_PATH}/favoritter`} component={FavouritesPage} />
                                        <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearchesPage} />
                                        <Route
                                            path={`${CONTEXT_PATH}/trekk-soknad/:uuid/:adUuid`}
                                            component={WithdrawApplicationPage}
                                        />
                                        <Route path="*" component={NotFound} />
                                    </Switch>
                                </main>
                            </HistoryProvider>
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
