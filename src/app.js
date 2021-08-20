import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { analyticsSaga } from './analytics';
import authenticationReducer, { authenticationSaga } from './authentication/authenticationReducer';
import errorReducer from './error/errorReducer';
import Application from './Application';
import facetsReducer from './search/facets/facetsReducer';
import searchQueryReducer, { searchQuerySaga } from './search/searchQueryReducer';
import unknownFacetsReducer from './search/facets/unknownFacetsReducer';
import { unknownFacetsSaga } from './search/facets/unknownFacetsReducer';
import userReducer, { userSaga } from './user/userReducer';
import favouritesReducer, { favouritesSaga } from './favourites/favouritesReducer';
import savedSearchAlertStripeReducer, { savedSearchAlertStripeSaga } from './savedSearches/alertstripe/savedSearchAlertStripeReducer';
import savedSearchFormReducer, { savedSearchFormSaga } from './savedSearches/form/savedSearchFormReducer';
import savedSearchesReducer, { savedSearchesSaga } from './savedSearches/savedSearchesReducer';
import facetPanelsReducer, {facetPanelsSaga} from './search/facets/facetPanelsReducer';
import searchBoxReducer, { searchBoxSaga } from './search/searchBox/searchBoxReducer';
import searchReducer, { saga } from './search/searchReducer';
import stillingReducer, { stillingSaga } from './stilling/stillingReducer';
import internalStillingReducer, { internalStillingSaga } from './stilling/internalStillingReducer';
import './styles.less';
import './variables.less';
import * as Sentry from '@sentry/browser';

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(combineReducers({
    authentication: authenticationReducer,
    error: errorReducer,
    user: userReducer,
    favourites: favouritesReducer,
    savedSearches: savedSearchesReducer,
    savedSearchForm: savedSearchFormReducer,
    savedSearchAlertStripe: savedSearchAlertStripeReducer,
    search: searchReducer,
    searchBox: searchBoxReducer,
    searchQuery: searchQueryReducer,
    stilling: stillingReducer,
    internalStilling: internalStillingReducer,
    facets: facetsReducer,
    unknownFacets: unknownFacetsReducer,
    facetPanels: facetPanelsReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);
sagaMiddleware.run(searchBoxSaga);
sagaMiddleware.run(stillingSaga);
sagaMiddleware.run(internalStillingSaga);
sagaMiddleware.run(favouritesSaga);
sagaMiddleware.run(savedSearchesSaga);
sagaMiddleware.run(savedSearchFormSaga);
sagaMiddleware.run(savedSearchAlertStripeSaga);
sagaMiddleware.run(userSaga);
sagaMiddleware.run(authenticationSaga);
sagaMiddleware.run(unknownFacetsSaga);
sagaMiddleware.run(searchQuerySaga);
sagaMiddleware.run(analyticsSaga);
sagaMiddleware.run(facetPanelsSaga);

Sentry.init({
    dsn: "https://76170ea4b79246638c1d9eb1c0e4fca9@sentry.gc.nav.no/37",
    blacklistUrls: [
        new RegExp('localhost'),
        new RegExp('arbeidsplassen-q.nav.no')
    ]
});

ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('reactApp')
);
