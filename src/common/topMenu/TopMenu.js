import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PersonbrukerHeaderMeny, PersonbrukerHeader } from 'pam-frontend-header';
import { LOGIN_URL, LOGOUT_URL } from '../../fasitProperties';
import Disclaimer from '../../discalimer/Disclaimer';
import featureToggle from '../../featureToggle';

class TopMenu extends React.Component {
    onLoginClick = () => {
        window.location.href = LOGIN_URL;
    };

    onLogoutClick = () => {
        window.location.href = LOGOUT_URL;
    };

    render() {
        return (
            <div>
                {featureToggle() ? (
                    <PersonbrukerHeaderMeny
                        onLoggUt={this.onLogoutClick}
                        onLoggInn={this.onLoginClick}
                        personbruker={{ navn: 'Innstillinger' }}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                ) : (
                    <PersonbrukerHeader />
                )}
                <Disclaimer />
            </div>
        );
    }
}

TopMenu.defaultProps = {
    isAuthenticated: undefined
};

TopMenu.propTypes = {
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user
});

export default connect(mapStateToProps)(TopMenu);
