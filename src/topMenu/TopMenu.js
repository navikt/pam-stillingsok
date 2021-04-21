import { AuthStatus, PersonbrukerApplikasjon } from 'pam-frontend-header';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { authenticationEnum, REDIRECT_TO_LOGIN } from '../authentication/authenticationReducer';
import { LOGOUT_URL } from '../fasitProperties';
import { COLLAPSE_ALL_FACET_PANELS, EXPAND_ALL_FACET_PANELS } from '../search/facets/facetPanelsReducer';
import { isMobile } from '../utils';
import LoginButton from './LoginButton';
import './TopMenu.less';
import Header from "../header/Header";
import {USER_IS_UNDER_FIFTEEN} from "../user/userReducer";

const uinnloggetHeader = document.getElementById('ArbeidsplassenHeader');

const TopMenu = ({ isAuthenticated, collapseAllFacetPanels, expandAllFacetPanels, redirectToLogin, setErUnderFemten }) => {
    const login = (role) => {
        redirectToLogin(role);
    };

    const logout = () => {
        window.location.href = LOGOUT_URL;
    };

    const authenticationStatus = (status) => {
        if (status === authenticationEnum.IS_AUTHENTICATED) {
            return AuthStatus.IS_AUTHENTICATED;
        }
        if (status === authenticationEnum.NOT_AUTHENTICATED) {
            return AuthStatus.NOT_AUTHENTICATED;
        }
        return AuthStatus.UNKNOWN;
    };

    if (authenticationStatus(isAuthenticated) === AuthStatus.IS_AUTHENTICATED) {
        uinnloggetHeader.className = 'ArbeidsplassenHeader--hidden';

        return (
            <div className="no-print">
                <Header
                    validerNavigasjon={{
                        redirectTillates: () => {
                            // Reset state of facet panel (closed if on mobile) and return true to complete the redirect
                            if (isMobile()) {
                                collapseAllFacetPanels();
                            } else {
                                expandAllFacetPanels();
                            }
                            return true;
                        }
                    }}
                    onLoginClick={login}
                    onLogoutClick={logout}
                    onErUnderFemten={setErUnderFemten}
                    useMenu="personbruker"
                    authenticationStatus={authenticationStatus(isAuthenticated)}
                    applikasjon={PersonbrukerApplikasjon.STILLINGSSOK}
                    visInnstillinger
                    showName
                />
            </div>
        );
    } else if (authenticationStatus(isAuthenticated) === AuthStatus.NOT_AUTHENTICATED) {
        return (
            ReactDOM.createPortal(
                <LoginButton redirectToLogin={login}/>,
                document.getElementById('ArbeidsplassenHeader__login')
            )
        );
    }
    return null;
};

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired,
    collapseAllFacetPanels: PropTypes.func.isRequired,
    expandAllFacetPanels: PropTypes.func.isRequired,
    redirectToLogin: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    redirectToLogin: (role) => dispatch({ type: REDIRECT_TO_LOGIN, role }),
    collapseAllFacetPanels: () => dispatch({ type: COLLAPSE_ALL_FACET_PANELS }),
    expandAllFacetPanels: () => dispatch({ type: EXPAND_ALL_FACET_PANELS }),
    setErUnderFemten: (erUnderFemten) => dispatch({ type: USER_IS_UNDER_FIFTEEN, erUnderFemten})
});

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
