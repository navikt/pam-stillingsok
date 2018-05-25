import React from 'react';
import ReactDOM from 'react-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import searchReducer, { saga } from './domene';
import { getUrlParameterByName, toUrlParams } from './utils';
import SearchPage from './SearchPage';
import './../styles.less';
import './../colorTheme.less';
import './sok.less';

export const getInitialStateFromUrl = (url) => {
    const stateFromUrl = {};
    const q = getUrlParameterByName('q', url);
    const from = getUrlParameterByName('from', url);
    const sort = getUrlParameterByName('sort', url);
    const counties = getUrlParameterByName('counties', url);
    const municipals = getUrlParameterByName('municipals', url);
    const heltidDeltid = getUrlParameterByName('heltidDeltid', url);
    const engagementType = getUrlParameterByName('engagementType', url);
    const sektor = getUrlParameterByName('sektor', url);

    if (q) stateFromUrl.q = q;
    if (from) stateFromUrl.from = parseInt(from, 10);
    if (sort) stateFromUrl.sort = sort;
    if (counties) stateFromUrl.counties = counties.split('_');
    if (municipals) stateFromUrl.municipals = municipals.split('_');
    if (heltidDeltid) stateFromUrl.heltidDeltid = heltidDeltid.split('_');
    if (engagementType) stateFromUrl.engagementType = engagementType.split('_');
    if (sektor) stateFromUrl.sektor = sektor.split('_');
    return stateFromUrl;
};

export const createUrlParamsFromState = (state) => {
    const { query } = state;
    const urlQuery = {};
    if (query.q) urlQuery.q = query.q;
    if (query.sort) urlQuery.sort = query.sort;
    if (query.from) urlQuery.from = query.from;
    if (query.counties && query.counties.length > 0) urlQuery.counties = query.counties.join('_');
    if (query.municipals && query.municipals.length > 0) urlQuery.municipals = query.municipals.join('_');
    if (query.heltidDeltid && query.heltidDeltid.length > 0) urlQuery.heltidDeltid = query.heltidDeltid.join('_');
    if (query.engagementType && query.engagementType.length > 0) urlQuery.engagementType = query.engagementType.join('_');
    if (query.sektor && query.sektor.length > 0) urlQuery.sektor = query.sektor.join('_');
    return toUrlParams(urlQuery);
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(searchReducer, composeWithDevTools(
    applyMiddleware(sagaMiddleware)));


store.subscribe(() => {
    if (store.getState().isSearching) {
        const urlParams = createUrlParamsFromState(store.getState());
        if (urlParams && urlParams.length > 0) {
            window.history.replaceState('', '', `?${urlParams}`);
        } else {
            window.history.replaceState('', '', window.location.pathname);
        }
    }
});

sagaMiddleware.run(saga);

ReactDOM.render(
    <Provider store={store}>
        <SearchPage urlParams={getInitialStateFromUrl(window.location.href)} />
    </Provider>,
    document.getElementById('app')
);

