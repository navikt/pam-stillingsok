import React from "react";
import ReactDOM from "react-dom";
import AuthenticationProvider, { fixUrlAfterLogin } from "./modules/auth/contexts/AuthenticationProvider";
import UserProvider from "./modules/user/contexts/UserProvider";
import FavouritesProvider from "./modules/favourites/context/FavouritesProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BrowserSupportInfo from "./common/components/browserSupportInfo/BrowserSupportInfo";
import Header from "./modules/header/Header";
import { CONTEXT_PATH } from "./common/environment";
import FavouritesPage from "./pages/favoritter";
import SavedSearchesPage from "./pages/lagrede-sok";
import RapporterAnnonse from "./pages/rapporter-annonse";
import initSentry from "./common/tracking/sentry";
import { initAmplitude } from "./common/tracking/amplitude";
import HistoryProvider from "./common/context/HistoryProvider";
import "./common/styles/styles.less";
import AdPage from "./pages/stilling";
import TrekkSoknadPage from "./pages/trekk-soknad";
import SuperraskSoknadPage from "./pages/superrask-soknad";
import SearchPage from "./pages/sok";

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
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid/superrask-soknad`} component={SuperraskSoknadPage} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid/superrask-soknad`} component={SuperraskSoknadPage} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={AdPage} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={AdPage} />
                                <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={RapporterAnnonse} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={FavouritesPage} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearchesPage} />
                                <Route path={`${CONTEXT_PATH}/trekk-soknad/:uuid/:adUuid`} component={TrekkSoknadPage} />
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
