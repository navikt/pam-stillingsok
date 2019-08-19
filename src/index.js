// Polyfills så det skal virke i IE11
import 'react-app-polyfill/ie11';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/object/entries';
import 'core-js/features/string/includes';
import 'core-js/features/string/starts-with';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import authenticationReducer, { authenticationSaga } from './authentication/authenticationReducer';
import backLinkReducer, { backLinkSaga } from './backLink/backLinkReducer';
import errorReducer from './error/errorReducer';
import Application from './Application';
import facetsReducer from './search/facets/facetsReducer';
import searchQueryReducer, { searchQuerySaga } from './search/searchQueryReducer';
import unknownFacetsReducer from './search/facets/unknownFacetsReducer';
import { unknownFacetsSaga } from './search/facets/unknownFacetsReducer';
import userReducer, { userSaga } from './user/userReducer';
import favouritesReducer, { favouritesSaga } from './favourites/favouritesReducer';
import savedSearchAlertStripeReducer, { savedSearchAlertStripeSaga } from './savedSearches/alertstripe/savedSearchAlertStripeReducer';
import savedSearchExpandReducer from './savedSearches/expand/savedSearchExpandReducer';
import savedSearchFormReducer, { savedSearchFormSaga } from './savedSearches/form/savedSearchFormReducer';
import savedSearchesReducer, { savedSearchesSaga } from './savedSearches/savedSearchesReducer';
import facetPanelsReducer from './search/facets/facetPanelsReducer';
import searchBoxReducer, { searchBoxSaga } from './search/searchBox/searchBoxReducer';
import searchReducer, { saga } from './search/searchReducer';
import stillingReducer, { stillingSaga } from './stilling/stillingReducer';
import './styles.less';
import './variables.less';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    authentication: authenticationReducer,
    backLink: backLinkReducer,
    error: errorReducer,
    user: userReducer,
    favourites: favouritesReducer,
    savedSearches: savedSearchesReducer,
    savedSearchForm: savedSearchFormReducer,
    savedSearchAlertStripe: savedSearchAlertStripeReducer,
    savedSearchExpand: savedSearchExpandReducer,
    search: searchReducer,
    searchBox: searchBoxReducer,
    searchQuery: searchQueryReducer,
    stilling: stillingReducer,
    facets: facetsReducer,
    unknownFacets: unknownFacetsReducer,
    facetPanels: facetPanelsReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);
sagaMiddleware.run(backLinkSaga);
sagaMiddleware.run(searchBoxSaga);
sagaMiddleware.run(stillingSaga);
sagaMiddleware.run(favouritesSaga);
sagaMiddleware.run(savedSearchesSaga);
sagaMiddleware.run(savedSearchFormSaga);
sagaMiddleware.run(savedSearchAlertStripeSaga);
sagaMiddleware.run(userSaga);
sagaMiddleware.run(authenticationSaga);
sagaMiddleware.run(unknownFacetsSaga);
sagaMiddleware.run(searchQuerySaga);


ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('app')
);
