import { Container } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Error from './error/Error';
import Disclaimer from './discalimer/Disclaimer';
import { CONTEXT_PATH, LOGIN_URL_REDIRECT, LOGOUT_URL } from './fasitProperties';
import Favourites from './favourites/Favourites';
import featureToggle from './featureToggle';
import Invite from './invite/Invite';
import SavedSearches from './savedSearches/SavedSearches';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import NotAuthenticatedModal from './authentication/NotAuthenticatedModal';
import TermsOfUse from './user/TermsOfUse';
import { FETCH_IS_AUTHENTICATED } from './authentication/authenticationReducer';
import UserSettings from './user/UserSettings';
import UserAlertStripe from './user/UserAlertStripe';

class Application extends React.Component {
    componentDidMount() {
        if (featureToggle()) {
            this.props.fetchIsAuthenticated();
        }
    }
    
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Error />
                    {featureToggle() && (
                        <div className="AuthButtons no-print">
                            <Container>
                                {this.props.isAuthenticated === false ? (
                                    <a
                                        className="knapp knapp--mini"
                                        href={`${LOGIN_URL_REDIRECT}${window.location.href}`}
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
                    <Disclaimer />
                    <Switch>
                        <Route exact path="/" component={SearchPage} />
                        <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                        <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                        <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                        <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                        <Route path={`${CONTEXT_PATH}/innstillinger`} component={UserSettings} />
                        <Route path="*" component={SearchPage} />
                    </Switch>

                    {this.props.termsOfUseModalIsVisible && (
                        <TermsOfUse />
                    )}

                    {this.props.authenticationRequiredModalIsVisible && (
                        <NotAuthenticatedModal />
                    )}
                    <UserAlertStripe />
                </div>
            </BrowserRouter>
        );
    }
}

Application.defaultProps = {
    isAuthenticated: undefined
};

Application.propTypes = {
    fetchIsAuthenticated: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    termsOfUseModalIsVisible: PropTypes.bool.isRequired,
    authenticationRequiredModalIsVisible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated,
    termsOfUseModalIsVisible: state.user.termsOfUseModalIsVisible,
    authenticationRequiredModalIsVisible: state.authentication.authenticationRequiredModalIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    fetchIsAuthenticated: () => dispatch({ type: FETCH_IS_AUTHENTICATED })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
