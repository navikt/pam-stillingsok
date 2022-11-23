import React from "react";
import ReactDOM from "react-dom";
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
import initSentry from "./tracking/sentry";
import { initAmplitude } from "./tracking/amplitude";
import "./styles/styles.less";
import HistoryProvider from "./context/HistoryProvider";
import RegisterInterest from "./pages/registerInterest/RegisterInterest";
import RegisterInterestDeleted from "./pages/registerInterest/RegisterInterestDeleted";

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
                                <Route exact path={CONTEXT_PATH} component={Search} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid/meld-interesse`} component={RegisterInterest} />
                                <Route path={`${CONTEXT_PATH}/interessemelding-slettet`} component={RegisterInterestDeleted} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={Ad} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={Ad} />
                                <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={ReportAd} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                                <Route path="*" component={Search} />
                            </Switch>
                        </HistoryProvider>
                    </BrowserRouter>
                </FavouritesProvider>
            </UserProvider>
        </AuthenticationProvider>
    );
}

ReactDOM.render(<Application />, document.getElementById("main-content"));
