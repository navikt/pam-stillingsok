import React from "react";
import ReactDOM from "react-dom";
import "@navikt/ds-css";
import "@navikt/arbeidsplassen-css";
import { Footer } from "@navikt/arbeidsplassen-react";
import AuthenticationProvider, { fixUrlAfterLogin } from "./modules/auth/contexts/AuthenticationProvider";
import UserProvider from "./modules/user/contexts/UserProvider";
import FavouritesProvider from "./modules/favourites/context/FavouritesProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BrowserSupportInfo from "./common/components/browserSupportInfo/BrowserSupportInfo";
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
import "nav-frontend-core/less/core.less";
import "./common/styles/styles.css";
import googleTranslateWorkaround from "./common/utils/googleTranslateWorkaround";

initSentry();
fixUrlAfterLogin();
initAmplitude();
googleTranslateWorkaround();

function Application() {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>
                    <a className="dsa-skiplink" href="#main-content">
                        Gå til hovedinnhold
                    </a>
                    <div className="push-footer-down">
                        <BrowserRouter>
                            <HistoryProvider>
                                <BrowserSupportInfo tillatLukking={true} />
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
                                        <Route path="*" component={SearchPage} />
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

ReactDOM.render(<Application />, document.getElementById("app"));
