import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { FETCH_USER } from './authorization/authorizationReducer';
import TermsOfUse from './authorization/TermsOfUse';
import { CONTEXT_PATH, LOGIN_URL, LOGOUT_URL } from './fasitProperties';
import Favourites from './favourites/Favourites';
import featureToggle from './featureToggle';
import history from './history';
import Invite from './invite/Invite';
import SavedSearches from './savedSearches/SavedSearches';
import SearchPage from './search/Search';
import StillingPage from './stilling/Stilling';

class Application extends React.Component {
    componentDidMount() {
        if (featureToggle()) {
            this.props.fetchUser();
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
                        <Route path={`${CONTEXT_PATH}/vilkaar`} component={TermsOfUse} />
                        <Route path="*" component={SearchPage} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

Application.propTypes = {
    fetchUser: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    fetchUser: () => dispatch({ type: FETCH_USER })
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
