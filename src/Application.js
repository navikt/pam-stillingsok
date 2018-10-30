import { Container } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import NotAuthenticatedModal from './user/NotAuthenticatedModal';
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
                        <div className="AuthButtons no-print">
                            <Container>
                                {this.props.isAuthenticated === false ? (
                                    <a
                                        className="knapp knapp--mini"
                                        href={`${LOGIN_URL}?redirect=${window.location.href}`}
                                    >
                                        Logg inn
                                    </a>
                                ) : (
                                    <a
                                        className="knapp knapp--mini"
                                        href={LOGOUT_URL}
                                    >
                                        Logg ut
                                    </a>
                                )}
                            </Container>
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

                    {this.props.authorizationError && (
                        <NotAuthenticatedModal />
                    )}

                </div>
            </Router>
        );
    }
}

Application.defaultProps = {
    authorizationError: undefined,
    isAuthenticated: undefined
};

Application.propTypes = {
    fetchIsAuthenticated: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    termsOfUseModalIsVisible: PropTypes.bool.isRequired,
    authorizationError: PropTypes.string
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
    termsOfUseModalIsVisible: state.user.termsOfUseModalIsVisible,
    authorizationError: state.user.authorizationError
});

const mapDispatchToProps = (dispatch) => ({
    fetchIsAuthenticated: () => dispatch({ type: FETCH_IS_AUTHENTICATED })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
