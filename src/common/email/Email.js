import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input } from 'nav-frontend-skjema';
import { SET_EMAIL, VALIDATE_EMAIL } from './emailReducer';

class Email extends React.Component {
    onEmailChange = (e) => {
        this.props.setEmail(e.target.value);
    };

    onEmailBlur = () => {
        const { email, emailRequired } = this.props;
        if (email && email.length > 0) {
            this.props.setEmail(email.trim());
        }
        this.props.validateEmail(emailRequired);
    };

    render() {
        const { label, email, emailError, inputRef } = this.props;
        return (
            <Input
                label={label}
                value={email || ''}
                onChange={this.onEmailChange}
                onBlur={this.onEmailBlur}
                inputRef={inputRef}
                feil={emailError ? {
                    feilmelding: emailError
                } : undefined}
            />
        );
    }
}

Email.defaultProps = {
    emailError: undefined,
    emailRequired: false,
    inputRef: undefined,
    email: undefined
};

Email.propTypes = {
    label: PropTypes.string.isRequired,
    email: PropTypes.string,
    emailError: PropTypes.string,
    setEmail: PropTypes.func.isRequired,
    validateEmail: PropTypes.func.isRequired,
    inputRef: PropTypes.func,
    emailRequired: PropTypes.bool
};

const mapStateToProps = (state) => ({
    email: state.email.email,
    emailError: state.email.emailError
});

const mapDispatchToProps = (dispatch) => ({
    setEmail: (value) => dispatch({ type: SET_EMAIL, value }),
    validateEmail: (emailRequired) => dispatch({ type: VALIDATE_EMAIL, emailRequired })
});

export default connect(mapStateToProps, mapDispatchToProps)(Email);
