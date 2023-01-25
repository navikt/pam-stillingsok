import React from "react";
import ReactDOM from "react-dom";
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
import "./common/styles/styles.less";
import SearchPage from "./modules/search/SearchPage";
import SuperraskSoknadPage from "./modules/superrask-soknad/SuperraskSoknadPage";
import AdPage from "./modules/ad/AdPage";
import ReportAdPage from "./modules/report-ad/ReportAdPage";
import FavouritesPage from "./modules/favourites/FavouritesPage";
import SavedSearchesPage from "./modules/saved-searches/SavedSearchesPage";
import TrekkSoknadPage from "./modules/superrask-soknad/TrekkSoknadPage";

initSentry();
fixUrlAfterLogin();
initAmplitude();

function Application() {
    return (
        <AuthenticationProvider>
            <UserProvider>
                <FavouritesProvider>
                    <BrowserRouter>
                        <HistoryProvider>
                            <BrowserSupportInfo tillatLukking={true} />
                            <Switch>
                                <Route component={Header} />
                            </Switch>
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
                        </HistoryProvider>
                    </BrowserRouter>
                </FavouritesProvider>
            </UserProvider>
        </AuthenticationProvider>
    );
}

ReactDOM.render(<Application />, document.getElementById("main-content"));
