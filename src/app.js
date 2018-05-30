import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import searchReducer, { saga } from './search/domene';
import searchBoxReducer, { searchBoxSaga } from './search/searchbox/searchBoxRedux';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import { CONTEXT_PATH } from './fasitProperties';
import './styles.less';
import './variables.less';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    search: searchReducer,
    searchBox: searchBoxReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);
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

