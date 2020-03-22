import { AuthStatus, Header, PersonbrukerApplikasjon } from 'pam-frontend-header';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { authenticationEnum, REDIRECT_TO_LOGIN } from '../authentication/authenticationReducer';
import { LOGOUT_URL } from '../fasitProperties';
import { COLLAPSE_ALL_FACET_PANELS, EXPAND_ALL_FACET_PANELS } from '../search/facets/facetPanelsReducer';
import { isMobile } from '../utils';
import './TopMenu.less';

const TopMenu = ({ isAuthenticated, collapseAllFacetPanels, expandAllFacetPanels, redirectToLogin }) => {
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

    return (
        <div className="no-print">
            <div className={classNames("TopMenu", {"TopMenu--uinnlogget": authenticationStatus(isAuthenticated) !== AuthStatus.IS_AUTHENTICATED}) }>
                <Header
                    validerNavigasjon={{
                        redirectTillates: () => {
                            // Reset state of facet panel (closed if on mobile) and return true to complete the redirect
                            if(isMobile()) {
                                collapseAllFacetPanels();
                            } else {
                                expandAllFacetPanels();
                            }
                            return true;
                        }
                    }}
                    onLoginClick={login}
                    onLogoutClick={logout}
                    useMenu="personbruker"
                    authenticationStatus={authenticationStatus(isAuthenticated)}
                    applikasjon={PersonbrukerApplikasjon.STILLINGSSOK}
                    visInnstillinger
                    showName
                />
                {authenticationStatus(isAuthenticated) !== AuthStatus.IS_AUTHENTICATED && (
                    <div className="Header__nav__wrapper">
                        <nav className="Header__nav">
                            <a className="Header__tab Header__tab--active" href="/stillinger">Ledige stillinger</a>
                            <a className="Header__tab" href="/ledige-kandidater">Ledige kandidater</a>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
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
    expandAllFacetPanels: () => dispatch({ type: EXPAND_ALL_FACET_PANELS })
});

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
