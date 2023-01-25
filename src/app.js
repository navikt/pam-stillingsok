import React from "react";
import ReactDOM from "react-dom";
import AuthenticationProvider, { fixUrlAfterLogin } from "./common/context/AuthenticationProvider";
import UserProvider from "./common/context/UserProvider";
import FavouritesProvider from "./common/context/FavouritesProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BrowserSupportInfo from "./common/components/browserSupportInfo/BrowserSupportInfo";
import Header from "./common/components/header/Header";
import { CONTEXT_PATH } from "./environment";
import Search from "./pages/sok/Search";
import Ad from "./pages/stilling/Ad";
import Favourites from "./pages/favoritter/Favourites";
import SavedSearches from "./pages/lagrede-sok/SavedSearches";
import ReportAd from "./pages/rapporter-annonse/ReportAd";
import initSentry from "./common/tracking/sentry";
import { initAmplitude } from "./common/tracking/amplitude";
import "./styles/styles.less";
import HistoryProvider from "./common/context/HistoryProvider";
import InterestForm from "./pages/superrask-soknad/InterestForm";
import InterestMessageDelete from "./pages/superrask-soknad/InterestMessageDelete";

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
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid/superrask-soknad`} component={InterestForm} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid/superrask-soknad`} component={InterestForm} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={Ad} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={Ad} />
                                <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={ReportAd} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                                <Route path={`${CONTEXT_PATH}/trekk-soknad/:uuid/:adUuid`} component={InterestMessageDelete} />
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
