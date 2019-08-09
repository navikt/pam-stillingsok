import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PersonbrukerApplikasjon, Header, AuthStatus } from 'pam-frontend-header';
import { LOGIN_URL, LOGOUT_URL } from '../../fasitProperties';
import { authenticationEnum } from '../../authentication/authenticationReducer';
import { getRedirect } from '../../redirect';
import { COLLAPSE_ALL_FACET_PANELS, EXPAND_ALL_FACET_PANELS } from '../../search/facets/facetPanelsReducer';
import { isMobile } from '../../utils';

const TopMenu = ({ isAuthenticated, collapseAllFacetPanels, expandAllFacetPanels }) => {
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
        }
        if (status === authenticationEnum.NOT_AUTHENTICATED) {
            return AuthStatus.NOT_AUTHENTICATED;
        }
        return AuthStatus.UNKNOWN;
    };

    return (
        <div className="no-print">
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
        </div>
    );
};

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired,
    collapseAllFacetPanels: PropTypes.func.isRequired,
    expandAllFacetPanels: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

const mapDispatchToProps = (dispatch) => ({
    collapseAllFacetPanels: () => dispatch({ type: COLLAPSE_ALL_FACET_PANELS }),
    expandAllFacetPanels: () => dispatch({ type: EXPAND_ALL_FACET_PANELS })
});

export default connect(mapStateToProps, mapDispatchToProps)(TopMenu);
