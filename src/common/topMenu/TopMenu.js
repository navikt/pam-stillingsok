import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PersonbrukerHeaderMeny, PersonbrukerHeader, PersonbrukerApplikasjon } from 'pam-frontend-header';
import { LOGIN_URL, LOGOUT_URL } from '../../fasitProperties';
import { authenticationEnum } from '../../authentication/authenticationReducer';
import { getRedirect } from '../../redirect';

class TopMenu extends React.Component {
    onLoginClick = () => {
        window.location.href = `${LOGIN_URL}${getRedirect()}`;
    };

    onLogoutClick = () => {
        window.location.href = LOGOUT_URL;
    };

    render() {
        return (
            <div className="no-print">
                {this.props.isAuthenticated === authenticationEnum.IS_AUTHENTICATED
                    || this.props.isAuthenticated === authenticationEnum.NOT_AUTHENTICATED ? (
                        <PersonbrukerHeaderMeny
                            onLoggUt={this.onLogoutClick}
                            onLoggInn={this.onLoginClick}
                            personbruker={{ navn: 'Innstillinger' }}
                            erInnlogget={this.props.isAuthenticated === authenticationEnum.IS_AUTHENTICATED}
                            applikasjon={PersonbrukerApplikasjon.STILLINGSSOK}
                        />
                    ) : (
                        <PersonbrukerHeader />
                    )}
            </div>
        );
    }
}

TopMenu.propTypes = {
    isAuthenticated: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

export default connect(mapStateToProps)(TopMenu);
