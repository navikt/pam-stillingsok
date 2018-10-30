import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { FETCH_IS_AUTHENTICATED } from './user/userReducer';
import TermsOfUse from './user/TermsOfUse';
import { CONTEXT_PATH, LOGIN_URL, LOGOUT_URL } from './fasitProperties';
import Favourites from './favourites/Favourites';
import featureToggle from './featureToggle';
import history from './history';
import Invite from './invite/Invite';
import SavedSearches from './savedSearches/SavedSearches';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import UserSettings from './user/UserSettings';
import ViewTermsOfUse from './user/ViewTermsOfUse';

class Application extends React.Component {
    componentDidMount() {
        if (featureToggle()) {
            this.props.fetchIsAuthenticated();
        }
    }

    render() {
        return (
            <Router history={history}>
                <div>
                    {featureToggle() && (
                        <div className="Auth-buttons no-print">
                            <a
                                className="knapp knapp--hoved knapp--mini"
                                href={`${LOGIN_URL}?redirect=${window.location.href}`}
                            >
                                Logg inn
                            </a>
                            <a
                                className="knapp knapp--hoved knapp--mini"
                                href={LOGOUT_URL}
                            >
                                Logg ut
                            </a>
                        </div>
                    )}
                    <Switch>
                        <Route exact path="/" component={SearchPage} />
                        <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                        <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                        <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                        <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                        <Route path={`${CONTEXT_PATH}/minside`} component={UserSettings} />
                        <Route path={`${CONTEXT_PATH}/vilkar`} component={ViewTermsOfUse} />
                        <Route path="*" component={SearchPage} />
                    </Switch>

                    {this.props.termsOfUseModalIsVisible && (
                        <TermsOfUse />
                    )}
                </div>
            </Router>
        );
    }
}

Application.propTypes = {
    fetchIsAuthenticated: PropTypes.func.isRequired,
    termsOfUseModalIsVisible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    termsOfUseModalIsVisible: state.user.termsOfUseModalIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    fetchIsAuthenticated: () => dispatch({ type: FETCH_IS_AUTHENTICATED })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
