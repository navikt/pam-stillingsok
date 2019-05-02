import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PersonbrukerApplikasjon, Header, AuthStatus } from 'pam-frontend-header';
import { LOGIN_URL, LOGOUT_URL } from '../../fasitProperties';
import { authenticationEnum } from '../../authentication/authenticationReducer';
import { getRedirect } from '../../redirect';

const TopMenu = ({ isAuthenticated, personErUnderOppfolging }) => {
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
        } else if (status === authenticationEnum.NOT_AUTHENTICATED) {
            return AuthStatus.NOT_AUTHENTICATED;
        } else {
            return AuthStatus.UNKNOWN;
        }
    };

    return (
        <div className="no-print">
            <Header
                onLoginClick={login}
                onLogoutClick={logout}
                useMenu='personbruker'
                authenticationStatus={authenticationStatus(isAuthenticated)}
                applikasjon={PersonbrukerApplikasjon.STILLINGSSOK}
                visAktivitetsplanLenke={personErUnderOppfolging}
                visInnstillinger

            />
        </div>
    );
};

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired,
    personErUnderOppfolging: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated,
    personErUnderOppfolging: state.user.personIsUnderOppfolging
});

export default connect(mapStateToProps)(TopMenu);
