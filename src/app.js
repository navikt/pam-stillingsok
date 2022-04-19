import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import useUrlFix from "./hooks/useUrlFix";
import useHotjar from "./hooks/useHotjar";
import NotificationsProvider from "./context/NotificationsProvider";
import AuthenticationProvider from "./context/AuthenticationProvider";
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
import "./styles/styles.less";

Sentry.init({
    dsn: "https://76170ea4b79246638c1d9eb1c0e4fca9@sentry.gc.nav.no/37",
    blacklistUrls: [new RegExp("localhost"), new RegExp("arbeidsplassen-q.nav.no")]
});

function Application() {
    useUrlFix();
    useHotjar();

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

ReactDOM.render(
    <Application />,
    document.getElementById("main-content")
);
