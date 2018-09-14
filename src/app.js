import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import SavedSearches from './savedSearches/SavedSearches';
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
import disclaimerReducer from './discalimer/disclaimerReducer';
import favoritesReducer, { favoritesSaga } from './favorites/favoritesReducer';
import savedSearchesReducer, { savedSearchesSaga } from './savedSearches/savedSearchesReducer';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import Invite from './invite/Invite';
import { CONTEXT_PATH } from './fasitProperties';
import Favorites from './favorites/Favorites';
import './styles.less';
import './variables.less';

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
    disclaimer: disclaimerReducer,
    favorites: favoritesReducer,
    savedSearches: savedSearchesReducer
}), applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);
sagaMiddleware.run(searchBoxSaga);
sagaMiddleware.run(stillingSaga);
sagaMiddleware.run(favoritesSaga);
sagaMiddleware.run(savedSearchesSaga);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                    <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                    <Route path={`${CONTEXT_PATH}/favoritter`} component={Favorites} />
                    <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                    <Route path="*" component={SearchPage} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
