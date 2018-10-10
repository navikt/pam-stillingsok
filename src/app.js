import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import disclaimerReducer from './discalimer/disclaimerReducer';
import { CONTEXT_PATH } from './fasitProperties';
import Favourites from './favourites/Favourites';
import favouritesReducer, { favouritesSaga } from './favourites/favouritesReducer';
import Invite from './invite/Invite';
import savedSearchAlertStripeReducer, { savedSearchAlertStripeSaga } from './savedSearches/alertstripe/savedSearchAlertStripeReducer';
import savedSearchErrorReducer from './savedSearches/error/savedSearchErrorReducer';
import savedSearchExpandReducer from './savedSearches/expand/savedSearchExpandReducer';
import savedSearchFormReducer, { savedSearchFormSaga } from './savedSearches/form/savedSearchFormReducer';
import SavedSearches from './savedSearches/SavedSearches';
import savedSearchesReducer, { savedSearchesSaga } from './savedSearches/savedSearchesReducer';
import countiesReducer from './search/facets/counties/countiesReducer';
import engagementReducer from './search/facets/engagement/engagementReducer';
import extentReducer from './search/facets/extent/extentReducer';
import occupationsReducer from './search/facets/occupations/occupationsReducer';
import publishedReducer from './search/facets/published/publishedReducer';
import sectorReducer from './search/facets/sector/sectorReducer';
import SearchPage from './search/Search';
import searchBoxReducer, { searchBoxSaga } from './search/searchBox/searchBoxReducer';
import searchReducer, { saga } from './search/searchReducer';
import sortingReducer from './search/sorting/sortingReducer';
import viewModeReducer from './search/viewMode/viewModeReducer';
import StillingPage from './stilling/Stilling';
import stillingReducer, { stillingSaga } from './stilling/stillingReducer';
import './styles.less';
import { urlSaga } from './urlReducer';
import './variables.less';
import authorizationReducer, { authorizationSaga } from './authorization/authorizationReducer';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    authorization: authorizationReducer,
    counties: countiesReducer,
    disclaimer: disclaimerReducer,
    engagement: engagementReducer,
    extent: extentReducer,
    favourites: favouritesReducer,
    occupations: occupationsReducer,
    published: publishedReducer,
    savedSearches: savedSearchesReducer,
    savedSearchForm: savedSearchFormReducer,
    savedSearchAlertStripe: savedSearchAlertStripeReducer,
    savedSearchError: savedSearchErrorReducer,
    savedSearchExpand: savedSearchExpandReducer,
    search: searchReducer,
    searchBox: searchBoxReducer,
    sector: sectorReducer,
    sorting: sortingReducer,
    stilling: stillingReducer,
    viewMode: viewModeReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);
sagaMiddleware.run(searchBoxSaga);
sagaMiddleware.run(stillingSaga);
sagaMiddleware.run(favouritesSaga);
sagaMiddleware.run(savedSearchesSaga);
sagaMiddleware.run(savedSearchFormSaga);
sagaMiddleware.run(savedSearchAlertStripeSaga);
sagaMiddleware.run(urlSaga);
sagaMiddleware.run(authorizationSaga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                    <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                    <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                    <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                    <Route path="*" component={SearchPage} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
