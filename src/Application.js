import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Footer from './common/footer/Footer';
import Error from './error/Error';
import { CONTEXT_PATH } from './fasitProperties';
import Favourites from './favourites/Favourites';
import Feedback from './feedback/Feedback';
import Invite from './invite/Invite';
import SavedSearches from './savedSearches/SavedSearches';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import NotAuthenticatedModal from './authentication/NotAuthenticatedModal';
import TermsOfUse from './user/termsOfUse/TermsOfUse';
import { FETCH_IS_AUTHENTICATED } from './authentication/authenticationReducer';
import UserSettings from './user/UserSettings';
import UserAlertStripe from './user/UserAlertStripe';
import TopMenu from './common/topMenu/TopMenu';

const Application = ({ authenticationRequiredModalIsVisible, fetchIsAuthenticated, user }) => {
    useEffect(() => {
        fetchIsAuthenticated();
    }, []);

    return (
        <BrowserRouter>
            <div className="Application">
                <main className="Application__main">
                    <Error />
                    <Switch>
                        <Route component={TopMenu} />
                    </Switch>
                    <Switch>
                        <Route exact path="/" component={SearchPage} />
                        <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                        <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                        <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                        <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                        <Route path={`${CONTEXT_PATH}/innstillinger`} component={UserSettings} />
                        <Route
                            path={`${CONTEXT_PATH}/samtykke`}
                            component={user ? SearchPage : TermsOfUse}
                        />
                        <Route path="*" component={SearchPage} />
                    </Switch>
                    {authenticationRequiredModalIsVisible && (
                        <NotAuthenticatedModal />
                    )}
                    <UserAlertStripe />
                    <Feedback />
                </main>
                <footer className="Application__footer">
                    <Footer />
                </footer>
            </div>
        </BrowserRouter>
    );
};

Application.defaultProps = {
    user: undefined
};

Application.propTypes = {
    fetchIsAuthenticated: PropTypes.func.isRequired,
    authenticationRequiredModalIsVisible: PropTypes.bool.isRequired,
    user: PropTypes.shape({})
};

const mapStateToProps = (state) => ({
    authenticationRequiredModalIsVisible: state.authentication.authenticationRequiredModalIsVisible,
    user: state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    fetchIsAuthenticated: () => dispatch({ type: FETCH_IS_AUTHENTICATED })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
