import { Container } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { LOGIN_URL, LOGOUT_URL } from '../fasitProperties';
import './AuthenticationButton.less';

function AuthenticationButton({ isAuthenticated }) {
    return (
        <div className="AuthenticationButton-wrapper no-print">
            <Container>
                {isAuthenticated ? (
                    <a className="AuthenticationButton typo-element" href={LOGOUT_URL}>
                        Logg ut
                    </a>
                ) : (
                    <a
                        className="AuthenticationButton typo-element"
                        href={`${LOGIN_URL}?redirect=${window.location.href}`}
                    >
                        Logg inn
                    </a>
                )}
            </Container>
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
