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
import occupationsReducer from './search/facets/occupations/occupationsReducer';
import publishedReducer from './search/facets/published/publishedReducer';
import engagementReducer from './search/facets/engagement/engagementReducer';
import sectorReducer from './search/facets/sector/sectorReducer';
import extentReducer from './search/facets/extent/extentReducer';
import focusReducer from './search/focusReducer';
import disclaimerReducer from './discalimer/disclaimerReducer';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import Invite from './invite/Invite';
import { CONTEXT_PATH, LOGIN_URL, LOGOUT_URL } from './fasitProperties';
import './styles.less';
import './variables.less';
import { Hovedknapp } from 'nav-frontend-knapper';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
    search: searchReducer,
    searchBox: searchBoxReducer,
    sorting: sortingReducer,
    counties: countiesReducer,
    published: publishedReducer,
    occupations: occupationsReducer,
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

function onLoginClick() {
    window.location.href = `${LOGIN_URL}?redirect=${window.location.href}`;
}

function onLogoutClick() {
    window.location.href = LOGOUT_URL;
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <div className="Auth-buttons">
                    <Hovedknapp
                        mini
                        onClick={onLoginClick}
                    >
                        Logg inn
                    </Hovedknapp>
                    <Hovedknapp
                        mini
                        onClick={onLogoutClick}
                    >
                        Logg ut
                    </Hovedknapp>
                </div>
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                    <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                    <Route path="*" component={SearchPage} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);

