import { Footer } from 'pam-frontend-footer';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { FETCH_IS_AUTHENTICATED, HANDLE_CALLBACK_AFTER_LOGIN } from './authentication/authenticationReducer';
import NotAuthenticatedModal from './authentication/NotAuthenticatedModal';
import BackLinkManager from './backLink/BackLinkManager';
import TopMenu from './topMenu/TopMenu';
import Error from './error/Error';
import { CONTEXT_PATH } from './fasitProperties';
import Favourites from './favourites/Favourites';
import SavedSearches from './savedSearches/SavedSearches';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import TermsOfUse from './user/TermsOfUse';
import UserAlertStripe from './user/UserAlertStripe';

class Application extends React.Component {
    componentDidMount() {
        this.props.fetchIsAuthenticated();
        this.props.handleCallbackAfterLogin();
    }

    render() {
        return (
            <BrowserRouter>
                <BackLinkManager>
                    <div className="Application">
                        <main className="Application__main">
                            <Error />
                            <Switch>
                                <Route component={TopMenu}/>
                            </Switch>
                            <Switch>
                                <Route exact path={CONTEXT_PATH} component={SearchPage}/>
                                <Route exact path={`${CONTEXT_PATH}/stilling`} component={StillingPage} />
                                <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                                <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                                <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                                <Route path="*" component={SearchPage}/>
                            </Switch>

                            {this.props.termsOfUseModalIsVisible && (
                                <TermsOfUse />
                            )}

                            {this.props.authenticationRequiredModalIsVisible && (
                                <NotAuthenticatedModal />
                            )}
                            <UserAlertStripe/>
                        </main>
                        <footer className="Application__footer">
                            <Footer />
                        </footer>
                    </div>
                </BackLinkManager>
            </BrowserRouter>
        );
    }
}

Application.propTypes = {
    fetchIsAuthenticated: PropTypes.func.isRequired,
    handleCallbackAfterLogin: PropTypes.func.isRequired,
    termsOfUseModalIsVisible: PropTypes.bool.isRequired,
    authenticationRequiredModalIsVisible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    termsOfUseModalIsVisible: state.user.termsOfUseModalIsVisible,
    authenticationRequiredModalIsVisible: state.authentication.authenticationRequiredModalIsVisible
});

const mapDispatchToProps = (dispatch) => ({
    fetchIsAuthenticated: () => dispatch({ type: FETCH_IS_AUTHENTICATED }),
    handleCallbackAfterLogin: () => dispatch({ type: HANDLE_CALLBACK_AFTER_LOGIN })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
