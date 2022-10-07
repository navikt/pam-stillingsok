import React from "react";
import ReactDOM from "react-dom";
import AuthenticationProvider, { fixUrlAfterLogin } from "./modules/Authentication/AuthenticationProvider";
import UserProvider from "./modules/User/UserProvider";
import FavouritesProvider from "./modules/Favourites/FavouritesProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BrowserSupportInfo from "./components/browserSupportInfo/BrowserSupportInfo";
import Header from "./components/Header/Header";
import { CONTEXT_PATH } from "./environment";
import initSentry from "./tracking/sentry";
import { initAmplitude } from "./tracking/amplitude";
import "./styles/styles.less";
import HistoryProvider from "./context/HistoryProvider";
import FavouritesPage from "./pages/favoritter";
import RegisterInterestPage from "./pages/stilling/meld-interesse";
import AdPage from "./pages/stilling";
import ReportAdPage from "./pages/rapporter-annonse";
import SavedSearchesPage from "./pages/lagrede-sok";
import SearchPage from "./pages";

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
                                    path={`${CONTEXT_PATH}/stilling/:uuid/meld-interesse`}
                                    component={RegisterInterestPage}
                                />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={AdPage} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={AdPage} />
                                <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={ReportAdPage} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={FavouritesPage} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearchesPage} />
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
