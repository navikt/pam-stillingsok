import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import authenticationReducer, { authenticationSaga } from './authentication/authenticationReducer';
import errorReducer from './error/errorReducer';
import Application from './Application';
import userReducer, { userSaga } from './user/userReducer';
import disclaimerReducer from './disclaimer/disclaimerReducer';
import favouritesReducer, { favouritesSaga } from './favourites/favouritesReducer';
import savedSearchAlertStripeReducer, { savedSearchAlertStripeSaga } from './savedSearches/alertstripe/savedSearchAlertStripeReducer';
import savedSearchExpandReducer from './savedSearches/expand/savedSearchExpandReducer';
import savedSearchFormReducer, { savedSearchFormSaga } from './savedSearches/form/savedSearchFormReducer';
import savedSearchesReducer, { savedSearchesSaga } from './savedSearches/savedSearchesReducer';
import countiesReducer from './search/facets/counties/countiesReducer';
import engagementReducer from './search/facets/engagement/engagementReducer';
import extentReducer from './search/facets/extent/extentReducer';
import countriesReducer from './search/facets/countries/countriesReducer';
import occupationsReducer from './search/facets/occupations/occupationsReducer';
import publishedReducer from './search/facets/published/publishedReducer';
import sectorReducer from './search/facets/sector/sectorReducer';
import searchBoxReducer, { searchBoxSaga } from './search/searchBox/searchBoxReducer';
import searchReducer, { saga } from './search/searchReducer';
import sortingReducer from './search/sorting/sortingReducer';
import viewModeReducer, { viewModeSaga } from './search/viewMode/viewModeReducer';
import stillingReducer, { stillingSaga } from './stilling/stillingReducer';
import './styles.less';
import { urlSaga } from './urlReducer';
import './variables.less';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    authentication: authenticationReducer,
    error: errorReducer,
    user: userReducer,
    counties: countiesReducer,
    countries: countriesReducer,
    disclaimer: disclaimerReducer,
    engagement: engagementReducer,
    extent: extentReducer,
    favourites: favouritesReducer,
    occupations: occupationsReducer,
    published: publishedReducer,
    savedSearches: savedSearchesReducer,
    savedSearchForm: savedSearchFormReducer,
    savedSearchAlertStripe: savedSearchAlertStripeReducer,
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
sagaMiddleware.run(userSaga);
sagaMiddleware.run(viewModeSaga);
sagaMiddleware.run(authenticationSaga);


ReactDOM.render(
    <Provider store={store}>
        <Application />
    </Provider>,
    document.getElementById('app')
);
