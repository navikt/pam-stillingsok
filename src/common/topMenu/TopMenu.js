import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PersonbrukerApplikasjon, Header, AuthStatus } from 'pam-frontend-header';
import { LOGIN_URL, LOGOUT_URL } from '../../fasitProperties';
import { authenticationEnum } from '../../authentication/authenticationReducer';
import { getRedirect } from '../../redirect';
import { isMobile } from '../../utils';
import { SET_FACET_PANELS_INITIAL_CLOSED } from '../../search/searchReducer';

const TopMenu = ({ isAuthenticated, closeFacetPanels }) => {
    const login = (role) => {
        if (role === 'personbruker') {
            window.location.href = `${LOGIN_URL}${getRedirect()}`;
        } else {
            window.location.href = `${LOGIN_URL}${window.location.origin}/stillingsregistrering`;
        }
    };

    const logout = () => {
        window.location.href = LOGOUT_URL;
    };

    const authenticationStatus = (status) => {
        if (status === authenticationEnum.IS_AUTHENTICATED) {
            return AuthStatus.IS_AUTHENTICATED;
        } if (status === authenticationEnum.NOT_AUTHENTICATED) {
            return AuthStatus.NOT_AUTHENTICATED;
        }
        return AuthStatus.UNKNOWN;
    };

    return (
        <div className="no-print">
            <Header
                validerNavigasjon={{
                    redirectTillates: () => {
                        // Close facet panels if on mobile, and return true to complete the redirect
                        if (isMobile) {
                            closeFacetPanels();
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
        </div>
    );
};

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired,
    closeFacetPanels: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    closeFacetPanels: () => dispatch({ type: SET_FACET_PANELS_INITIAL_CLOSED })
});

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
