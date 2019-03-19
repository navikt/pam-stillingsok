import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PersonbrukerHeaderMeny, PersonbrukerHeader, PersonbrukerApplikasjon } from 'pam-frontend-header';
import { LOGIN_URL, LOGOUT_URL } from '../../fasitProperties';
import { authenticationEnum } from '../../authentication/authenticationReducer';
import { getRedirect } from '../../redirect';

const TopMenu = ({ isAuthenticated }) => (
    <div className="no-print">
        {isAuthenticated === authenticationEnum.IS_AUTHENTICATED || isAuthenticated === authenticationEnum.NOT_AUTHENTICATED ? (
            <PersonbrukerHeaderMeny
                loggInnUrl={`${LOGIN_URL}${getRedirect()}`}
                loggUtUrl={LOGOUT_URL}
                personbruker={{ navn: 'Innstillinger' }}
                erInnlogget={isAuthenticated === authenticationEnum.IS_AUTHENTICATED}
                applikasjon={PersonbrukerApplikasjon.STILLINGSSOK}
            />
        ) : (
            <PersonbrukerHeader />
        )}
    </div>
);

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

export default connect(mapStateToProps)(TopMenu);
