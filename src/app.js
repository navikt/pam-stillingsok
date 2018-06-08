import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import searchReducer, { saga } from './search/searchReducer';
import searchBoxReducer, { searchBoxSaga } from './search/searchBox/searchBoxReducer';
import stillingReducer, { stillingSaga } from './stilling/stillingReducer';
import sortingReducer from './search/sorting/sortingReducer';
import countiesReducer from './search/facets/counties/countiesReducer';
import createdReducer from './search/facets/created/createdReducer';
import engagementReducer from './search/facets/engagement/engagementReducer';
import sectorReducer from './search/facets/sector/sectorReducer';
import extentReducer from './search/facets/extent/extentReducer';
import focusReducer from './search/focusReducer';
import disclaimerReducer from './discalimer/disclaimerReducer';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import { CONTEXT_PATH } from './fasitProperties';
import './styles.less';
import './variables.less';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    search: searchReducer,
    searchBox: searchBoxReducer,
    sorting: sortingReducer,
    counties: countiesReducer,
    created: createdReducer,
    engagement: engagementReducer,
    sector: sectorReducer,
    extent: extentReducer,
    stilling: stillingReducer,
    focus: focusReducer,
    disclaimer: disclaimerReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);
sagaMiddleware.run(searchBoxSaga);
sagaMiddleware.run(stillingSaga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={SearchPage} />
                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                <Route path="*" component={SearchPage} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);

