import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { LOGIN_URL, LOGOUT_URL } from '../fasitProperties';
import './AuthenticationButton.less';

function AuthenticationButton({ isAuthenticated }) {
    return (
        <div className="no-print">
            {isAuthenticated ? (
                <a
                    className="knapp knapp--hoved knapp--mini AuthenticationButton"
                    href={LOGOUT_URL}
                >
                        Logg ut
                </a>
            ) : (
                <a
                    className="knapp knapp--hoved knapp--mini AuthenticationButton"
                    href={`${LOGIN_URL}?redirect=${window.location.href}`}
                >
                        Logg inn
                </a>
            )}
        </div>
    );
}

AuthenticationButton.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authentication.isAuthenticated
});

export default connect(mapStateToProps)(AuthenticationButton);
