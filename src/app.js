import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './search/domene';
import searchResultsReducer, { searchResultsSaga } from './search/searchResults/searchResultsReducer';
import searchBoxReducer, { searchBoxSaga } from './search/searchBox/searchBoxReducer';
import paginationReducer from './search/pagination/paginationReducer';
import sortingReducer from './search/sorting/sortingReducer';
import countiesReducer from './search/facets/counties/countiesReducer';
import createdReducer from './search/facets/created/createdReducer';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import { CONTEXT_PATH } from './fasitProperties';
import './styles.less';
import './variables.less';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    reducer,
    searchResults: searchResultsReducer,
    searchBox: searchBoxReducer,
    pagination: paginationReducer,
    sorting: sortingReducer,
    counties: countiesReducer,
    created: createdReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(searchResultsSaga);
sagaMiddleware.run(searchBoxSaga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={SearchPage} />
                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
            </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);

