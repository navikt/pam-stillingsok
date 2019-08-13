import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import { LOGIN_URL } from '../fasitProperties';
import authenticationRedirectUrl from '../authentication/authenticationRedirectUrl';
import './NotAuthenticated.less';

export default class NotAuthenticated extends React.Component {
    onLoginClick = () => {
        window.location.href = `${LOGIN_URL}${authenticationRedirectUrl()}`;
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
    onCancel: PropTypes.func
};
