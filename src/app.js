import React from "react";
import ReactDOM from "react-dom";
import NotificationsProvider from "./context/NotificationsProvider";
import AuthenticationProvider, { fixUrlAfterLogin } from "./context/AuthenticationProvider";
import UserProvider from "./context/UserProvider";
import FavouritesProvider from "./context/FavouritesProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import BrowserSupportInfo from "./components/browserSupportInfo/BrowserSupportInfo";
import TopMenu from "./components/header/TopMenu";
import { CONTEXT_PATH } from "./environment";
import SearchPage from "./pages/search/Search";
import StillingPage from "./pages/stilling/Stilling";
import Favourites from "./pages/favourites/Favourites";
import SavedSearches from "./pages/savedSearches/SavedSearches";
import RapporterAnnonse from "./pages/rapporterAnnonse/RapporterAnnonse";
import initHotjar from "./api/hotjar/hotjar";
import initSentry from "./api/sentry/sentry";
import "./styles/styles.less";

initSentry();
fixUrlAfterLogin();
initHotjar();

function Application() {
    return (
        <NotificationsProvider>
            <AuthenticationProvider>
                <UserProvider>
                    <FavouritesProvider>
                        <BrowserRouter>
                            <BrowserSupportInfo tillatLukking={true} />
                            <Switch>
                                <Route component={TopMenu} />
                            </Switch>
                            <Switch>
                                <Route exact path={CONTEXT_PATH} component={SearchPage} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                                <Route path={`${CONTEXT_PATH}/intern/:uuid`} component={StillingPage} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                                <Route path={`${CONTEXT_PATH}/rapporter-annonse`} component={RapporterAnnonse} />
                                <Route path="*" component={SearchPage} />
                            </Switch>
                        </BrowserRouter>
                    </FavouritesProvider>
                </UserProvider>
            </AuthenticationProvider>
        </NotificationsProvider>
    );
}

ReactDOM.render(<Application />, document.getElementById("main-content"));
