import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Flatknapp, Hovedknapp } from '@navikt/arbeidsplassen-knapper';
import { connect } from 'react-redux';
import './NotAuthenticated.less';
import { REDIRECT_TO_LOGIN } from './authenticationReducer';

class NotAuthenticated extends React.Component {
    onLoginClick = () => {
        this.props.redirectToLogin();
    };

    render() {
        return (
            <div className="NotAuthenticated">
                <Undertittel className="NotAuthenticated__title">
                    {this.props.title}
                </Undertittel>
                <Normaltekst className="NotAuthenticated__message">
                    Logg inn med MinID, BankID, BankID på mobil, Buypass eller Commfides.
                </Normaltekst>
                <div className="NotAuthenticated__buttons">
                    <Hovedknapp onClick={this.onLoginClick}>Logg inn</Hovedknapp>
                    {this.props.onCancel && (
                        <Flatknapp onClick={this.props.onCancel}>
                            Avbryt
                        </Flatknapp>
                    )}
                </div>
            </div>
        );
    }
}

NotAuthenticated.defaultProps = {
    title: 'Du må logge inn',
    onCancel: undefined
};

NotAuthenticated.propTypes = {
    title: PropTypes.string,
    onCancel: PropTypes.func,
    redirectToLogin: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    redirectToLogin: () => dispatch({ type: REDIRECT_TO_LOGIN })
});

export default connect(mapStateToProps, mapDispatchToProps)(NotAuthenticated);
