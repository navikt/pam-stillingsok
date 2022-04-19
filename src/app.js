import React from "react";
import ReactDOM from "react-dom";
import NotificationsProvider from "./context/NotificationsProvider";
import AuthenticationProvider, { fixUrlAfterLogin } from "./context/AuthenticationProvider";
import UserProvider from "./context/UserProvider";
import FavouritesProvider from "./context/FavouritesProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BrowserSupportInfo from "./components/browserSupportInfo/BrowserSupportInfo";
import Header from "./components/header/Header";
import { CONTEXT_PATH } from "./environment";
import Search from "./pages/search/Search";
import Ad from "./pages/ad/Ad";
import Favourites from "./pages/favourites/Favourites";
import SavedSearches from "./pages/savedSearches/SavedSearches";
import ReportAd from "./pages/reportAd/ReportAd";
import initHotJar from "./api/hotjar/hotjar";
import initSentry from "./api/sentry/sentry";
import "./styles/styles.less";

initSentry();
fixUrlAfterLogin();
initHotJar();

function Application() {
    return (
        <NotificationsProvider>
            <AuthenticationProvider>
                <UserProvider>
                    <FavouritesProvider>
                        <BrowserRouter>
                            <BrowserSupportInfo tillatLukking={true} />
                            <Switch>
                                <Route component={Header} />
                            </Switch>
                            <Switch>
                                <Route exact path={CONTEXT_PATH} component={Search} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={Ad} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={Ad} />
                                <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={ReportAd} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                                <Route path="*" component={Search} />
                            </Switch>
                        </BrowserRouter>
                    </FavouritesProvider>
                </UserProvider>
            </AuthenticationProvider>
        </NotificationsProvider>
    );
}

ReactDOM.render(<Application />, document.getElementById("main-content"));
