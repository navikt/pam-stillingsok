import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import AuthenticationButton from './authentication/AuthenticationButton';
import { FETCH_AUTHENTICATION_STATUS } from './authentication/authenticationReducer';
import NotAuthenticatedModal from './authentication/NotAuthenticatedModal';
import { CONTEXT_PATH } from './fasitProperties';
import Favourites from './favourites/Favourites';
import featureToggle from './featureToggle';
import history from './history';
import Invite from './invite/Invite';
import SavedSearches from './savedSearches/SavedSearches';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';
import TermsOfUse from './termsOfUse/TermsOfUse';

class Application extends React.Component {
    componentDidMount() {
        this.props.fetchAuthenticationStatus();
    }

    render() {
        return (
            <Router history={history}>
                <div>
                    {featureToggle() && (
                        <AuthenticationButton />
                    )}
                    <Switch>
                        <Route exact path="/" component={SearchPage} />
                        <Route path={`${CONTEXT_PATH}/stilling/:uuid`} component={StillingPage} />
                        <Route path={`${CONTEXT_PATH}/mobil`} component={Invite} />
                        <Route path={`${CONTEXT_PATH}/favoritter`} component={Favourites} />
                        <Route path={`${CONTEXT_PATH}/lagrede-sok`} component={SavedSearches} />
                        <Route path={`${CONTEXT_PATH}/vilkaar`} component={TermsOfUse} />
                        <Route path="*" component={SearchPage} />
                    </Switch>
                    {this.props.isAuthenticationModalVisible && (<NotAuthenticatedModal />)}
                    {this.props.isTermsOfUseModalVisible && (<TermsOfUse />)}
                </div>
            </Router>
        );
    }
}

Application.propTypes = {
    isAuthenticationModalVisible: PropTypes.bool.isRequired,
    isTermsOfUseModalVisible: PropTypes.bool.isRequired,
    fetchAuthenticationStatus: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticationModalVisible: state.authenticationModal.isVisible,
    isTermsOfUseModalVisible: state.termsOfUse.isVisible
});

const mapDispatchToProps = (dispatch) => ({
    fetchAuthenticationStatus: () => dispatch({ type: FETCH_AUTHENTICATION_STATUS })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
