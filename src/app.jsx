import React, { useEffect } from "react";
import * as ReactDOMClient from "react-dom/client";
import "@navikt/ds-css";
import "@navikt/arbeidsplassen-css";
import { Footer, SkipLink } from "@navikt/arbeidsplassen-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Modal } from "@navikt/ds-react";
import AuthenticationProvider from "./modules/auth/contexts/AuthenticationProvider";
import UserProvider from "./modules/user/contexts/UserProvider";
import FavouritesProvider from "./modules/favourites/context/FavouritesProvider";
import Header from "./modules/header/Header";
import { CONTEXT_PATH } from "./common/environment";
import initSentry from "./common/tracking/sentry";
import { initAmplitude } from "./common/tracking/amplitude";
import HistoryProvider from "./common/context/HistoryProvider";
import SearchPage from "./modules/search/SearchPage";
import SuperraskSoknadPage from "./modules/superrask-soknad/SuperraskSoknadPage";
import AdPage from "./modules/ad/AdPage";
import ReportAdPage from "./modules/report-ad/ReportAdPage";
import FavouritesPage from "./modules/favourites/FavouritesPage";
import SavedSearchesPage from "./modules/saved-searches/SavedSearchesPage";
import TrekkSoknadPage from "./modules/superrask-soknad/TrekkSoknadPage";
import "./common/styles/styles.css";
import googleTranslateWorkaround from "./common/utils/googleTranslateWorkaround";
import NotFound404 from "./common/components/NotFound/NotFound404";

initSentry();
initAmplitude();
googleTranslateWorkaround();

function Application() {
    useEffect(() => {
        Modal.setAppElement("#app");
    }, []);

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
                                            path={`${CONTEXT_PATH}/stilling/:uuid/superrask-soknad`}
                                            component={SuperraskSoknadPage}
                                        />
                                        <Route
                                            path={`${CONTEXT_PATH}/intern/:uuid/superrask-soknad`}
                                            component={SuperraskSoknadPage}
                                        />
                                        <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={AdPage} />
                                        <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={AdPage} />
                                        <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={ReportAdPage} />
                                        <Route path={`${CONTEXT_PATH}/favoritter`} component={FavouritesPage} />
                                        <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearchesPage} />
                                        <Route
                                            path={`${CONTEXT_PATH}/trekk-soknad/:uuid/:adUuid`}
                                            component={TrekkSoknadPage}
                                        />
                                        <Route path="*" component={NotFound404} />
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
